const puppeteer = require('puppeteer');
const delay = require('delay');

async function getCurrentSpeed() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://fast.com');

  while (true) {
    const result = await page.evaluate(() => {
      const $ = document.querySelector.bind(document);

      return {
        downloadSpeed: Number($('#speed-value').textContent),
        uploadSpeed: Number($('#upload-value').textContent),
        speedUnit: $('#speed-units').textContent.trim(),
        isDone: Boolean($('#speed-value.succeeded') && $('#upload-value.succeeded'))
      };
    });

    if (result.isDone) {
      browser.close();
      return Promise.resolve(result);
    }

    await delay(100);
  }
}

module.exports = { getCurrentSpeed };
