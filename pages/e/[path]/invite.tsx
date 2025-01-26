import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import { PartialEvent } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { prisma } from 'utils/prisma/init';

import formatServerProps from 'utils/api/format-server-props';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import Invite from 'components/event/Invite';
import CenteredSection from 'components/layout/CenteredSection';

const InvitePage = ({ event }: { event: PartialEvent }) => {
  const parsedEvent = parseResponseDateStrings(event) as PartialEvent;

  return (
    <Layout
      title='Event Invite'
      header='TreeFolksYP'
      ogImage='https://tfyp-images.s3.amazonaws.com/Event+Check-in.png'
      description={'TreeFolks Young Professionals welcomes you to our ' + event.name}
    >
      <CenteredSection maxWidth='400px'>
        <Invite event={parsedEvent} />
      </CenteredSection>
    </Layout>
  );
};

export default InvitePage;

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
