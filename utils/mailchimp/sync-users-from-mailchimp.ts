import { mailchimpGet } from '.';
import { prisma } from 'utils/prisma/init';
import { generateProfilePath } from 'utils/user/generate-profile-path';

/**
 * Syncs users from Mailchimp to the local database
 * This function fetches all members from Mailchimp and creates or updates users in the database
 */
const syncUsersFromMailchimp = async (): Promise<void> => {
  try {
    console.log('Starting Mailchimp user sync...');

    // Get all members from Mailchimp
    // Using count=1000 to get a large batch (Mailchimp default is 10)
    const response = await mailchimpGet(`/lists/${process.env.MAILCHIMP_LIST_ID}/members`, {
      count: 1000,
      status: 'subscribed',
      fields: 'members.email_address,members.merge_fields,members.status,members.id,total_items',
      sort_field: 'last_changed',
      sort_dir: 'DESC',
    });
    console.log('Mailchimp response:', response);

    if (!response || !response.members || !Array.isArray(response.members)) {
      console.error('Failed to get members from Mailchimp or invalid response format');
      return;
    }

    console.log(`Found ${response.members.length} members in Mailchimp`);

    const syncedUsers = [];

    // Process each member
    for (const member of response.members) {
      try {
        const email = member.email_address.toLowerCase();
        const firstName = member.merge_fields?.FNAME || '';
        const lastName = member.merge_fields?.LNAME || '';

        // Check if user already exists with either email or email2 matching
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email }, { email2: email }],
          },
        });

        if (existingUser) {
          // User exists with either email or email2 matching, do nothing
          //console.log(`User with email ${email} already exists in the database (as email or email2)`);
        } else if (firstName && lastName) {
          // User doesn't exist and has both first and last name, create them
          //console.log(`Creating new user with email ${email} and name ${firstName} ${lastName}`);

          const name = `${firstName} ${lastName}`;

          // Create user in database
          await prisma.user.create({
            data: {
              email,
              name,
              profilePath: generateProfilePath({ name }),
            },
          });
          syncedUsers.push(name);
        }
      } catch (memberError) {
        console.error(`Error processing member ${member.email_address}:`, memberError);
        // Continue with next member
      }
    }
    if (syncedUsers.length > 0) console.log(`Synced ${syncedUsers.length} new users from Mailchimp:`, syncedUsers.join(', '));
    else console.log('No new users to sync from Mailchimp');

    console.log('Mailchimp user sync completed successfully');
  } catch (error) {
    console.error('Error syncing users from Mailchimp:', error);
  }
};

export default syncUsersFromMailchimp;
