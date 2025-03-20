/* eslint-env node */
const { join } = require('path');

/**
 * @type {import('puppeteer').Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),

  // Skip downloading the Chromium browser binary
  skipDownload: true,

  // Use the actual Chromium binary path (not the wrapper script)
  executablePath: '/usr/lib/chromium/chromium',
};
