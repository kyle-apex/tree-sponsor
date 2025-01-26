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
      title={event.name}
      header='TreeFolksYP'
      ogImage='https://secure.meetupstatic.com/photos/event/4/3/1/f/600_521177183.webp?w=750'
      description={'Kyle Hoskins invites you to join for the ' + event.name}
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
