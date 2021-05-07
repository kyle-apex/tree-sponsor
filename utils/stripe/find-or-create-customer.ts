import { Stripe, stripe } from './init';
//import { PrismaClient } from '@prisma/client';
//const prisma = new PrismaClient();

export const findOrCreateCustomer = async (email: string): Promise<string> => {
  const existingCustomers = await stripe.customers.list({ email: email });
  console.log('existing customers', existingCustomers);

  if (existingCustomers.data?.length > 0) return existingCustomers.data[0].id;

  const customer = await stripe.customers.create({ email: email });

  return customer.id;
};

//const customer = await stripe.customers.create({ email: email });
//let user = await prisma.user.findFirst({ where: { email: email } });

/*const t3 = new Date().getTime();
  console.log('t2 date', t3 - t2);
  await prisma.user.findFirst({ where: { email: 'kyle@kylehoskins.com' + Math.random() } });
  const t4 = new Date().getTime();
  console.log('t3 date', t4 - t3);*/
