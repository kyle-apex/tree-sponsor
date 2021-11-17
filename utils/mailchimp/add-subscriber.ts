const Mailchimp = require('mailchimp-api-v3');
//var md5 = require('md5');

// load and create api key and list id constants
const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;

// This bad boy will have the honor of representing mailchimp :)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
let mailchimp;

// If api constant is not undefined go head and instatiate mailchimp
if (MAILCHIMP_API_KEY) {
  mailchimp = new Mailchimp(MAILCHIMP_API_KEY);
}

// ==========> This function is in charge of actually trying to add a subscriber <==============
const addSubscriber = async (email: string, data?: Record<string, string>, update?: boolean) => {
  const { status, ...mergeFields } = data;
  // Make sure mailchimp, email and listid are all set and not undefined
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  if (!mailchimp || !email || !MAILCHIMP_LIST_ID) {
    const msg = `Ignoring adding subscriber, missing params ${!email ? 'email' : 'API Key or List ID'}`;
    console.warn(msg);
    throw msg;
  }

  try {
    if (!mergeFields['LNAME']) delete mergeFields['LNAME'];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const result = await mailchimp.post(`lists/${MAILCHIMP_LIST_ID}`, {
      update_existing: update !== undefined ? update : true,
      members: [
        {
          email_address: email.toLowerCase(),
          status: status || 'subscribed',
          merge_fields: mergeFields,
        },
      ],
    });
    console.log('result', result);
  } catch (err) {
    console.log('error adding subscriber', err);
  }
};

// ==========> This function is in charge of adding a tag to an already subscribed user with the given email <==============
/*
const addTag = email => {
  let emailHash = md5(email.toLowerCase());
  return mailchimp.post(`lists/${MAILCHIMP_LIST_ID}/members/${emailHash}/tags`, {
    // TODO make sure to change this part right here
    tags: [{"name": "fantasy football", "status": "active"}]
  }).then(m => {
      if (m && m.errors && Object.keys(m.errors).length > 0) {
          console.log('Error adding tag to subscriber ', m.errors);
      }
      return m;
  }).catch(err => {
      console.warn('Failed to tag subscriber', email, err);
  });
}*/

export default addSubscriber;
