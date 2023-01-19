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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const mailchimpGet = async (path: string, query?: any) => await mailchimp.get(path, query);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const mailchimpPost = async (path: string, params?: any) => await mailchimp.post(path, params);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
export const mailchimpPatch = async (path: string, params?: any) => await mailchimp.patch(path, params);
export default mailchimp;
