/**
 * Utility functions for analytics tracking
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * Extract query parameters from the current URL
 * @returns Record<string, string> of query parameters or null if none exist
 */
export const getQueryParamsFromUrl = (): Record<string, string> | null => {
  // Only run on client-side
  if (typeof window === 'undefined') {
    return null;
  }

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};

  urlSearchParams.forEach((value, key) => {
    params[key] = value;
  });

  return Object.keys(params).length > 0 ? params : null;
};

/**
 * Convert query parameters object to a string
 * @param params - Query parameters as an object
 * @returns Query parameters as a string or null if none exist
 */
export const convertQueryParamsToString = (params: Record<string, string> | null | undefined): string | null => {
  if (!params) {
    return null;
  }

  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

/**
 * Get query parameters, either from provided params or from the current URL
 * @param providedParams - Optional query parameters as an object
 * @returns Final query parameters as an object
 */
export const getQueryParams = (providedParams?: Record<string, string>): Record<string, string> | null => {
  if (providedParams) {
    return providedParams;
  }

  return getQueryParamsFromUrl();
};

/**
 * Get visitor email from localStorage
 * @returns The visitor's email or null if not found
 */
export const getVisitorEmail = (): string | null => {
  // Only run on client-side
  if (typeof window === 'undefined') {
    return null;
  }

  // Check for user email in localStorage
  const checkInEmail = localStorage.getItem('checkInEmail');
  const checkInEmail2 = localStorage.getItem('checkInEmail2');
  const signInEmail = localStorage.getItem('signInEmail');

  // Helper function to strip double quotes from email values
  const stripQuotes = (value: string | null): string | null => {
    if (!value) return null;
    return value.replace(/^"|"$/g, '');
  };

  // Use the first available email, stripping any double quotes
  return stripQuotes(checkInEmail) || stripQuotes(checkInEmail2) || stripQuotes(signInEmail) || null;
};

/**
 * Get or create visitor ID from localStorage
 * @returns The visitor's ID
 */
export const getVisitorId = (): string => {
  // Only run on client-side
  if (typeof window === 'undefined') {
    return '';
  }

  // Get or create visitor ID
  let visitorId = localStorage.getItem('visitorId');

  // If no visitor ID exists, create one
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem('visitorId', visitorId);
  }

  return visitorId;
};

export default {
  getQueryParams,
  getQueryParamsFromUrl,
  convertQueryParamsToString,
  getVisitorEmail,
  getVisitorId,
};
