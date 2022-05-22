import { NextApiRequest, NextApiResponse } from 'next';
import addTagToMembers from 'utils/mailchimp/add-tag-to-members';
import removeTagFromMembers from 'utils/mailchimp/remove-tag-from-members';

import getTagId from 'utils/mailchimp/get-tag-id';
import listMembersForTag from 'utils/mailchimp/list-members-for-tag';
import { findCustomer } from 'utils/stripe/find-customer';
import { getCustomerName } from 'utils/stripe/get-customer-name';
import { Stripe } from 'utils/stripe/init';
import { updateSubscriptionsForUser } from 'utils/stripe/update-subscriptions-for-user';
const stripe = new Stripe('sk_live_v3dPGXasMJAPhqD6e4hqXmnG' ?? '', { apiVersion: '2020-08-27' });
export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  //const tagId = await getTagId('Core Team');
  //await removeTagFromMembers(tagId, ['kyle@kylehoskins.com']);

  /*for await (const customer of stripe.customers.list({ limit: 5, expand: ['data.subscriptions'] })) {
    console.log('customer', customer.email);
  }*/
  updateSubscriptionsForUser('asebastianruiz@gmail.com');

  const existingCustomers: Stripe.ApiList<Stripe.Customer> = await stripe.customers.list({
    email: 'asebastianruiz@gmail.com',
    expand: ['data.subscriptions'],
  });
  //console.log('existingCustomers', existingCustomers);
  const customer = existingCustomers.data[0];

  //const customer = await findCustomer('asebastianruiz@gmail.com');
  //console.log('customer', customer);
  //console.log('name', getCustomerName(customer));
  res.status(200).json(customer); //await listMembersForTag(tagId)
}
