import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import { PartialEvent } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { prisma } from 'utils/prisma/init';

import formatServerProps from 'utils/api/format-server-props';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import PriorEventQuiz from 'components/event/PriorEventQuiz';

const CheckinPage = ({ event }: { event: PartialEvent }) => {
  const parsedEvent = parseResponseDateStrings(event) as PartialEvent;

  return (
    <Layout title='Event Tree ID' header='TreeFolksYP'>
      <LogoMessage justifyContent='start'>
        <PriorEventQuiz event={parsedEvent} />
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
