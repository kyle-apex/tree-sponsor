import { Stripe, stripe } from './init';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findOrCreateCustomer = async (email: string) => {
  const t1 = new Date().getTime();
  const existingCustomers = await stripe.customers.list({ email: email });
  const t2 = new Date().getTime();
  console.log('t1 date', t2 - t1);
  //const customer = await stripe.customers.create({ email: email });
  const customer = await prisma.user.findFirst({ where: { email: 'kyle@kylehoskins.com' } });
  const t3 = new Date().getTime();
  console.log('t2 date', t3 - t2);
  await prisma.user.findFirst({ where: { email: 'kyle@kylehoskins.com' + Math.random() } });
  const t4 = new Date().getTime();
  console.log('t3 date', t4 - t3);

  return customer.id;
};
