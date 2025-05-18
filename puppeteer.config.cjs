/* eslint-env node */
/**
 * @type {import('puppeteer').Configuration}
 */
module.exports = {
  // Skip downloading the Chromium browser binary
  skipDownload: true,

  // Use the actual Chromium binary path (not the wrapper script)
  executablePath: '/usr/lib/chromium/chromium',

  // Additional launch arguments to help with containerized environments
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-gl-drawing',
    '--headless=new',
  ],
};
