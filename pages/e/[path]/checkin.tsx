import Checkin from 'components/event/Checkin';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import { PartialEvent } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { prisma } from 'utils/prisma/init';

import { useEffect } from 'react';
import formatServerProps from 'utils/api/format-server-props';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import CheckinSessionProvider from 'components/event/CheckinSessionProvider';

const CheckinPage = ({ event, activeMemberCount }: { event: PartialEvent; activeMemberCount?: number }) => {
  const parsedEvent = parseResponseDateStrings(event) as PartialEvent;

  return (
    <Layout
      title='Event Checkin'
      header='TreeFolksYP'
      ogImage='https://tfyp-images.s3.amazonaws.com/Event+Check-in.png'
      description={'TreeFolks Young Professionals welcomes you to our ' + event.name}
    >
      <LogoMessage isCheckin={true} justifyContent='start'>
        <CheckinSessionProvider>
          <Checkin event={parsedEvent} activeMemberCount={activeMemberCount} />
        </CheckinSessionProvider>
      </LogoMessage>
    </Layout>
  );
};

export default CheckinPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path } = context.query;

  try {
    const event = await prisma.event.findFirst({
      where: { path: path + '' },
      include: {
        categories: { include: { trees: {} } },
        location: {},
      },
    });

    const calendarYear = new Date();
    calendarYear.setDate(calendarYear.getDate() - 365);

    const activeMembers = await prisma.subscriptionWithDetails.findMany({
      where: { lastPaymentDate: { gte: calendarYear } },
      distinct: ['email'],
      select: { email: true, lastPaymentDate: true },
    });
    formatServerProps(event);

    return { props: { event, activeMemberCount: activeMembers?.length || 0 } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { event: null, activeMemberCount: 0 } };
}
