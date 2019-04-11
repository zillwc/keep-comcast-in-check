const path = require('path');
const delay = require('delay');

require('dotenv').config({ path: path.resolve(__dirname, '../', 'CONFIG') });
const speedTestClient = require('./speed-test-clients/fast.js');
const textAlert = require('./failure-actions/text-alert/twilio');

const CHECK_INTERVAL = Number(process.env.MINUTES_CHECK_INTERVAL);
const TIME_TO_WAIT_FOR_FIX = Number(process.env.MINUTES_TO_ALLOW_FOR_FIX);
const MIN_DOWNLOAD_SPEED = parseFloat(process.env.MIN_DOWNLOAD_SPEED);
const MIN_UPLOAD_SPEED = parseFloat(process.env.MIN_UPLOAD_SPEED);
const SEND_TEXT_ALERT = Boolean(process.env.SEND_TEXT_ALERT);

async function getCurrentSpeed() {
  console.log('[+] fetching current download/upload speed...');
  const { downloadSpeed, uploadSpeed, speedUnit } = await speedTestClient.getCurrentSpeed();

  return {
    download: parseFloat(downloadSpeed),
    upload: parseFloat(uploadSpeed),
    unit: speedUnit,
  };
}

function validateSpeedExpectation(currentSpeed) {
  if (currentSpeed.download < MIN_DOWNLOAD_SPEED || currentSpeed.upload < MIN_UPLOAD_SPEED) {
    return false;
  }

  return true;
}

async function init() {
  let currentSpeed;
  let strSpeed;
  let speedNotUpToExpectation;
  let alreadyLetDown = false;

  while (true) {
    currentSpeed = await getCurrentSpeed();
    strSpeed = JSON.stringify(currentSpeed);
    speedNotUpToExpectation = validateSpeedExpectation(currentSpeed);

    if (!speedNotUpToExpectation) {
      if (alreadyLetDown) {
        // gave them time to fix, but speeds haven't improved, so lets take action
        alreadyLetDown = false;

        console.log(`[*] current speed STILL did not meet expectation: ${strSpeed}`);

        if (SEND_TEXT_ALERT) {
          await textAlert.sendAlert(`Speed expectation not met. Current speed: ${strSpeed}`);
        }

        continue;
      }

      console.log(`\n[*] current speed did not meet expectation: ${strSpeed}`);
      console.log(`[.] giving them some time (${TIME_TO_WAIT_FOR_FIX} minutes) to fix this..`);

      alreadyLetDown = true;
      await delay(TIME_TO_WAIT_FOR_FIX * 1000 * 60);

      continue;
    } else {
      console.log(`[*] current speed looks good: ${strSpeed}`);
    }

    console.log(`[.] sleeping for ${CHECK_INTERVAL} minutes...\n\n`);
    await delay(CHECK_INTERVAL * 1000 * 60);
  }
}

init();
