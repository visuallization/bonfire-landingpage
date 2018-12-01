const MailChimp = require('mailchimp-api-v3');
require('dotenv').config();

const { MAILCHIMP_API_KEY, MAILING_LIST_ID } = process.env;
const mailchimp = new MailChimp(MAILCHIMP_API_KEY);

export function handler(event, context, callback) {
  console.log("EVENT: ", event.body);

  return mailchimp.post(`/lists/${MAILING_LIST_ID}/members`, { email_address: event.body, status: 'subscribed' })
  .then(function(results) {
    console.log('RESULTS:', results);
    return {
      statusCode: 200,
      body: JSON.stringify(results)
    }
  })
  .catch(function(err) {
    console.log('ERROR:', err);
    return { statusCode: 422, body: String(err) };
  });
}

