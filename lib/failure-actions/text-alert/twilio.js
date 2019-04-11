const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'TWILIO_CONFIG') });
const Twilio = require('twilio');

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const FROM_PHONE_NUMBER = process.env.TWILIO_FROM_PHONE_NUMBER;

let client;

const defaultTo = process.env.PHONE_NUMBER_TO_ALERT;
const defaultMessage = 'Current speed does not meet expectations set';

function getTwilioClient() {
  if (!client) {
    client = Twilio(ACCOUNT_SID, AUTH_TOKEN);
  }

  return client;
}

function sendAlert(specifiedMessage, specifiedTo) {
  const message = specifiedMessage || defaultMessage;
  const sendTo = specifiedTo || defaultTo;
  const client = getTwilioClient();

  return client.messages.create({
    to: sendTo,
    from: FROM_PHONE_NUMBER,
    body: message,
  }, (err, msg) => {
    if (err) {
      throw err;
    }

    console.log(`[*] sent text alert to ${sendTo}`);
  });
}

module.exports = { sendAlert };
