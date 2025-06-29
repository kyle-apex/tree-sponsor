import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'utils/prisma/init';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import getEventImagePath from 'utils/aws/get-event-image-path';
import uploadImage from 'utils/aws/upload-image';
import { paramCase } from 'change-case';

/**
 * Simple function to extract content from XML tags
 */
function extractFromXml(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}(?:\\s+[^>]*)?>(.*?)<\\/${tag}>`, 'gs');
  const matches = [...xml.matchAll(regex)];
  return matches.map(match => match[1].trim());
}

/**
 * Extract CDATA content
 */
function extractCdata(text: string): string {
  if (text.includes('<![CDATA[')) {
    return text.replace(/^\s*<!\[CDATA\[(.*?)\]\]>\s*$/s, '$1');
  }
  return text;
}

/**
 * Extract content from HTML meta tags
 */
function extractMetaContent(html: string, property: string): string | null {
  const regex = new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["'][^>]*>`, 'i');
  const match = html.match(regex);
  return match ? match[1] : null;
}

/**
 * Extract text from HTML element by selector (enhanced version)
 */
function extractElementText(html: string, selector: string): string | null {
  // This is a simplified approach - for complex HTML parsing, a proper HTML parser would be better
  const classRegex = new RegExp(`<[^>]*class=["']${selector.replace('.', '')}["'][^>]*>(.*?)</[^>]*>`, 'i');
  const match = html.match(classRegex);

  // Try data attribute selector if class selector fails
  if (!match) {
    const dataRegex = new RegExp(`<[^>]*data-${selector.replace(/([A-Z])/g, '-$1').toLowerCase()}[^>]*>(.*?)</[^>]*>`, 'i');
    const dataMatch = html.match(dataRegex);
    return dataMatch ? dataMatch[1].trim() : null;
  }

  return match ? match[1].trim() : null;
}

/**
 * Extract structured data from JSON-LD script tags
 */
function extractJsonLd(html: string): any[] {
  const results = [];
  const regex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    try {
      const jsonData = JSON.parse(match[1].trim());
      results.push(jsonData);
    } catch (e) {
      console.error('Error parsing JSON-LD:', e);
    }
  }

  return results;
}

/**
 * Clean up address by removing redundant city/state information
 * For example: "1161 Angelina St., Austin, TX, 78702, Austin, TX, Austin, TX"
 * becomes "1161 Angelina St., Austin, TX, 78702"
 */
function normalizeAddress(address: string): string {
  if (!address) return '';

  // Split the address by commas
  const parts = address.split(',').map(part => part.trim());

  // Create a map to track unique parts (case-insensitive)
  const uniqueParts = new Map<string, string>();

  // Keep only unique parts while preserving order
  for (const part of parts) {
    const lowerPart = part.toLowerCase();
    if (!uniqueParts.has(lowerPart)) {
      uniqueParts.set(lowerPart, part);
    }
  }

  // Join the unique parts back together
  return Array.from(uniqueParts.values()).join(', ');
}

/**
 * Geocode an address using Mapbox Geocoding API
 * Returns latitude and longitude coordinates
 */
async function geocodeAddress(address: string): Promise<{ latitude: number | null; longitude: number | null }> {
  if (!address) {
    return { latitude: null, longitude: null };
  }

  try {
    // Normalize the address to remove redundant information
    const normalizedAddress = normalizeAddress(address);
    console.log(`Original address: "${address}"`);
    console.log(`Normalized address: "${normalizedAddress}"`);

    // URL encode the normalized address
    const encodedAddress = encodeURIComponent(normalizedAddress);

    // Make a request to the Mapbox Geocoding API
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?limit=1&access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
    const response = await axios.get(url);

    // Check if we got any features back
    if (response.data.features && response.data.features.length > 0) {
      const feature = response.data.features[0];

      // Mapbox returns coordinates as [longitude, latitude]
      return {
        longitude: feature.center[0],
        latitude: feature.center[1],
      };
    }

    return { latitude: null, longitude: null };
  } catch (error) {
    console.error('Error geocoding address:', error);
    return { latitude: null, longitude: null };
  }
}

/**
 * Extract location data from various sources in the HTML
 */
function extractLocationData(html: string): { name: string; address: string; latitude: number | null; longitude: number | null } {
  let locationName = '';
  let locationAddress = '';
  let latitude = null;
  let longitude = null;

  // Try to extract from class-based elements
  locationName = extractElementText(html, 'venueName') || '';
  locationAddress = extractElementText(html, 'venueAddress') || '';

  // Try to extract from meta tags
  const geoPosition = extractMetaContent(html, 'geo.position');
  if (geoPosition) {
    const [lat, lng] = geoPosition.split(';').map((coord: string) => parseFloat(coord.trim()));
    latitude = lat;
    longitude = lng;
  }

  // Try to extract from JSON-LD structured data
  const jsonLdData = extractJsonLd(html);
  for (const data of jsonLdData) {
    if (data && data['@type'] === 'Event' && data.location) {
      const location = data.location;

      if (!locationName && location.name) {
        locationName = location.name;
      }

      if (!locationAddress && location.address) {
        if (typeof location.address === 'string') {
          locationAddress = location.address;
        } else if (location.address.streetAddress) {
          // Schema.org PostalAddress format
          const addressParts = [];
          if (location.address.streetAddress) addressParts.push(location.address.streetAddress);
          if (location.address.addressLocality) addressParts.push(location.address.addressLocality);
          if (location.address.addressRegion) addressParts.push(location.address.addressRegion);
          if (location.address.postalCode) addressParts.push(location.address.postalCode);
          locationAddress = addressParts.join(', ');
        }
      }

      if (!latitude && !longitude && location.geo) {
        latitude = location.geo.latitude || null;
        longitude = location.geo.longitude || null;
      }
    }
  }

  // Try to extract from itemprop attributes
  if (!locationName) {
    const venueMatch = html.match(/<[^>]*itemprop=["']location["'][^>]*>([\s\S]*?)<\/[^>]*>/i);
    if (venueMatch) {
      const nameMatch = venueMatch[1].match(/<[^>]*itemprop=["']name["'][^>]*>([\s\S]*?)<\/[^>]*>/i);
      if (nameMatch) {
        locationName = nameMatch[1].trim();
      }
    }
  }

  // Try to extract address from itemprop
  if (!locationAddress) {
    const addressMatch = html.match(/<[^>]*itemprop=["']address["'][^>]*>([\s\S]*?)<\/[^>]*>/i);
    if (addressMatch) {
      locationAddress = addressMatch[1]
        .trim()
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ');
    }
  }

  return { name: locationName, address: locationAddress, latitude, longitude };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the RSS feed URL from environment variables
    const rssUrl = process.env.MEETUP_RSS_URL || 'https://www.meetup.com/treefolks-young-professionals/events/rss/';

    // Fetch the RSS feed
    const response = await axios.get(rssUrl);
    const xmlData = response.data;

    // Extract items from the feed using regex
    const itemsXml = xmlData.match(/<item>[\s\S]*?<\/item>/g) || [];

    // Track new events added
    const newEvents = [];

    // Process each item in the feed
    for (const itemXml of itemsXml) {
      const eventLinks = extractFromXml(itemXml, 'link');
      const eventGuids = extractFromXml(itemXml, 'guid');
      const eventTitles = extractFromXml(itemXml, 'title');
      const eventDescriptions = extractFromXml(itemXml, 'description');
      const eventPubDates = extractFromXml(itemXml, 'pubDate');

      if (!eventLinks.length || !eventGuids.length || !eventTitles.length) {
        continue; // Skip items without required fields
      }

      const eventLink = eventLinks[0];
      const eventGuid = eventGuids[0];
      const eventTitle = extractCdata(eventTitles[0]);
      const eventDescription = extractCdata(eventDescriptions[0]);
      const eventPubDate = new Date(eventPubDates[0]);

      // Check if the event already exists in the database
      const existingEvent = await prisma.event.findFirst({
        where: {
          OR: [{ identifier: eventGuid }, { path: paramCase(eventTitle) }],
        },
      });

      // If the event already exists, skip it
      if (existingEvent) {
        continue;
      }

      // Fetch the event page to get more details
      const eventPageResponse = await axios.get(eventLink);
      const htmlData = eventPageResponse.data;

      // Extract event details
      let eventImageUrl = '';
      let startDate = null;
      let endDate = null;
      let locationName = '';
      let locationAddress = '';
      let latitude = null;
      let longitude = null;

      // Try to extract the event image
      const ogImage = extractMetaContent(htmlData, 'og:image');
      if (ogImage) {
        eventImageUrl = ogImage;
      }

      // Try to extract the event date and time
      const dateTimeMatch = htmlData.match(/<time[^>]*datetime=["']([^"']+)["'][^>]*>/i);
      if (dateTimeMatch) {
        const dateTimeStr = dateTimeMatch[1];
        if (dateTimeStr) {
          startDate = new Date(dateTimeStr);
          // Set end date to 2 hours after start date by default
          endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);
        }
      }

      // Extract location data using the enhanced function
      const locationData = extractLocationData(htmlData);
      locationName = locationData.name;
      locationAddress = locationData.address;

      // Normalize the address to remove redundant information
      if (locationAddress) {
        locationAddress = normalizeAddress(locationAddress);
      }

      latitude = locationData.latitude;
      longitude = locationData.longitude;

      console.log('Extracted location data:', {
        name: locationName,
        address: locationAddress,
        coordinates: latitude && longitude ? `${latitude},${longitude}` : 'none',
      });

      // If we have an image URL, download it and upload to S3
      let pictureUrl = null;
      if (eventImageUrl) {
        try {
          // Generate a UUID for the image
          const uuid = uuidv4();
          const imagePath = getEventImagePath(uuid);

          // Download the image
          const imageResponse = await axios.get(eventImageUrl, { responseType: 'arraybuffer' });
          const imageBuffer = Buffer.from(imageResponse.data, 'binary');

          // Upload to S3
          pictureUrl = await uploadImage(imageBuffer, imageResponse.headers['content-type'] || 'image/jpeg', imagePath);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }

      // Handle location data - check if it exists first to avoid duplicates
      let locationId = null;
      if (locationName || locationAddress || (latitude && longitude)) {
        try {
          // Try to find an existing location with the same details
          let location = null;

          // Build a query to find matching locations
          const whereConditions = [];

          if (locationName && locationAddress) {
            // If we have both name and address, try to find an exact match first
            whereConditions.push({
              AND: [{ name: locationName }, { address: locationAddress }],
            });
          } else {
            // Otherwise, try to match on individual fields
            if (locationName) {
              whereConditions.push({ name: locationName });
            }

            if (locationAddress) {
              whereConditions.push({ address: locationAddress });
            }
          }

          if (latitude && longitude) {
            // Find locations with coordinates within a small radius (approximately 10 meters)
            const latDelta = 0.0001; // roughly 10 meters
            const lngDelta = 0.0001; // roughly 10 meters at equator, less at higher latitudes

            whereConditions.push({
              AND: [
                { latitude: { gte: latitude - latDelta } },
                { latitude: { lte: latitude + latDelta } },
                { longitude: { gte: longitude - lngDelta } },
                { longitude: { lte: longitude + lngDelta } },
              ],
            });
          }

          // If we have any conditions, try to find a matching location
          if (whereConditions.length > 0) {
            location = await prisma.location.findFirst({
              where: {
                OR: whereConditions,
              },
            });
          }

          // If no existing location found, create a new one
          if (!location) {
            // If we don't have coordinates but we have an address, try to geocode it
            if (!latitude && !longitude && locationAddress) {
              console.log(`Geocoding address: "${locationAddress}" for event "${eventTitle}"`);
              const geocodeResult = await geocodeAddress(locationAddress);

              if (geocodeResult.latitude && geocodeResult.longitude) {
                latitude = geocodeResult.latitude;
                longitude = geocodeResult.longitude;
                console.log(`Successfully geocoded address to: ${latitude}, ${longitude}`);
              } else {
                console.log(`Failed to geocode address: "${locationAddress}"`);
              }
            }

            location = await prisma.location.create({
              data: {
                name: locationName,
                address: locationAddress,
                latitude: latitude,
                longitude: longitude,
              },
            });
            console.log(`Created new location with ID ${location.id} for event "${eventTitle}"`);
          } else {
            console.log(`Reusing existing location with ID ${location.id} for event "${eventTitle}"`);
          }

          locationId = location.id;
        } catch (error) {
          console.error('Error handling location:', error);
        }
      } else {
        console.log(`No location data found for event "${eventTitle}"`);
      }

      // Create the event
      const newEvent = await prisma.event.create({
        data: {
          name: eventTitle,
          description: eventDescription,
          path: paramCase(eventTitle),
          identifier: eventGuid,
          pictureUrl: pictureUrl,
          externalRSVPLink: eventLink,
          startDate: startDate || eventPubDate,
          endDate: endDate || new Date((startDate || eventPubDate).getTime() + 2 * 60 * 60 * 1000),
          locationId: locationId,
          isPrivate: false,
        },
      });

      newEvents.push(newEvent);
    }

    return res.status(200).json({
      success: true,
      message: `Synced ${newEvents.length} new events from Meetup.com`,
      newEvents,
    });
  } catch (error) {
    console.error('Error syncing Meetup events:', error);
    return res.status(500).json({
      error: 'Failed to sync Meetup events',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
