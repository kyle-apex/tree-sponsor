import CircularProgress from '@mui/material/CircularProgress';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Stripe, stripe } from 'utils/stripe/init';
import { prisma } from 'utils/prisma/init';
import { sendDonationReceipt } from 'utils/email/send-donation-receipt';

const DonationSuccess = ({ returnUrl, amount }: { returnUrl?: string; amount?: number }) => {
  const router = useRouter();
  useEffect(() => {
    // If returnUrl is provided, redirect back to that page
    if (returnUrl) {
      router.push(returnUrl);
    }
  }, [returnUrl, router]);

  return (
    <Layout title='Donation Success'>
      <LogoMessage>
        <div className='center'>
          <h2>Thank you for your donation{amount ? ` of $${amount}` : ''}!</h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <CircularProgress color='primary' />
          </div>
        </div>
      </LogoMessage>
    </Layout>
  );
};

export default DonationSuccess;

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  const { query } = context;

  const props: {
    returnUrl?: string;
    amount?: number;
  } = {};

  let stripeSessionId;
  let returnUrl;
  if (query) {
    stripeSessionId = query.session_id as string;
    returnUrl = query.returnUrl as string;
  }

  // Always set a returnUrl, default to homepage if not provided
  props.returnUrl = returnUrl || '/';
  console.log('stripeSessionId:', stripeSessionId);
  if (stripeSessionId) {
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(stripeSessionId);
      const customer = (await stripe.customers.retrieve(stripeSession.customer as string)) as Stripe.Customer;
      console.log('stripeSession:', stripeSession);
      // Store donation data in StripeDonation table
      if (stripeSession.payment_status === 'paid') {
        const metadata = stripeSession.metadata || {};
        console.log('metadata:', metadata);
        const donationAmount = stripeSession.amount_total / 100;

        // Use $executeRaw to bypass TypeScript error until Prisma client is regenerated
        await prisma.$executeRaw`
          INSERT INTO StripeDonation (
            stripeSessionId,
            stripeCustomerId,
            amount,
            status,
            eventId,
            eventName,
            userId,
            metadata,
            createdDate
          ) VALUES (
            ${stripeSession.id},
            ${customer.id},
            ${donationAmount},
            ${stripeSession.payment_status},
            ${metadata.eventId ? parseInt(metadata.eventId) : null},
            ${metadata.eventName || null},
            ${metadata.userId ? parseInt(metadata.userId) : null},
            ${JSON.stringify(metadata)},
            NOW()
          )
        `;

        // Set the donation amount in props
        props.amount = donationAmount;

        // Send thank you receipt email
        try {
          // Get customer email from Stripe
          const customerEmail = customer.email || metadata.userEmail;

          if (customerEmail) {
            // If there's an event associated with this donation, fetch it

            // Send the receipt email
            await sendDonationReceipt(customerEmail, donationAmount);

            console.log('Donation receipt email sent to:', customerEmail);
          } else {
            console.log('No email available to send donation receipt');
          }
        } catch (emailError) {
          console.error('Error sending donation receipt email:', emailError);
          // Don't fail the overall process if email sending fails
        }
      }
    } catch (err: unknown) {
      console.log('Error processing donation:', err);
    }
  }

  return {
    props: props,
  };
}
