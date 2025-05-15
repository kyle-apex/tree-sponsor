import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import { PartialEvent, PartialUser } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { prisma } from 'utils/prisma/init';

import formatServerProps from 'utils/api/format-server-props';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import Invite from 'components/event/Invite';
import CenteredSection from 'components/layout/CenteredSection';
import createInvitePreviewImage from 'utils/events/create-invite-preview-image';

const InvitePage = ({
  event,
  invitedByUser,
  name,
  email,
}: {
  event: PartialEvent;
  invitedByUser?: PartialUser;
  name?: string;
  email?: string;
}) => {
  const parsedEvent = parseResponseDateStrings(event) as PartialEvent;

  return (
    <Layout
      title={event.name}
      header='TreeFolksYP'
      ogImage={
        event.pictureUrl && invitedByUser?.image
          ? `https://sponsortrees.s3.amazonaws.com/event-invite/${event.id}-${invitedByUser.id}`
          : event.pictureUrl
      }
      description={`${invitedByUser?.name || 'TreeFolksYP'} invites you to join for the ${event.name}`}
    >
      <CenteredSection maxWidth='450px'>
        <Invite event={parsedEvent} invitedByUser={invitedByUser} name={name} email={email} />
      </CenteredSection>
    </Layout>
  );
};

export default InvitePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path, u, name, email } = context.query;
  try {
    const event = await prisma.event.findFirst({
      where: { path: path + '' },
      include: {
        RSVPs: { include: { user: { select: { id: true, name: true, image: true } } } },
        location: {},
      },
    });
    formatServerProps(event);

    let invitedByUser = null;
    if (u) {
      const user = await prisma.user.findFirst({ where: { id: Number(u) } });
      console.log('user');
      if (user?.id) invitedByUser = { id: user.id, name: user.name, image: user.image };

      // If invitedByUser has an image and event has a pictureUrl, create an invite preview image
      if (invitedByUser?.image && event?.pictureUrl) {
        try {
          const url = await createInvitePreviewImage(event.pictureUrl, event.id + '-' + invitedByUser.id.toString(), invitedByUser.image);
          console.log('url', url);
        } catch (error) {
          console.error('Error creating invite preview image:', error);
        }
      }
    }

    return { props: { event, invitedByUser, name: name || null, email: email || null } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { event: null as PartialEvent | null } };
}
