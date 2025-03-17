/* eslint-env node */
/**
 * @type {import('puppeteer').Configuration}
 */
module.exports = {
  // Skip downloading the Chromium browser binary
  skipDownload: true,

  // Use the system-installed Chromium
  executablePath: '/usr/bin/chromium',
};
