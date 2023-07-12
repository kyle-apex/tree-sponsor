import Checkin from 'components/event/Checkin';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import { PartialEvent } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { prisma } from 'utils/prisma/init';

import { useEffect } from 'react';
import formatServerProps from 'utils/api/format-server-props';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';

const CheckinPage = ({ event }: { event: PartialEvent }) => {
  const parsedEvent = parseResponseDateStrings(event) as PartialEvent;

  return (
    <Layout
      title='Event Checkin'
      header='TreeFolksYP'
      ogImage='https://tfyp-images.s3.amazonaws.com/Event+Check-in.png'
      description={'TreeFolks Young Professionals welcomes you to our ' + event.name}
    >
      <LogoMessage isCheckin={true} justifyContent='start'>
        <Checkin event={parsedEvent} />
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
    formatServerProps(event);

    return { props: { event } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { event: null } };
}
