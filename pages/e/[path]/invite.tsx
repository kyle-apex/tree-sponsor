import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import { PartialEvent, PartialUser } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { prisma } from 'utils/prisma/init';

import formatServerProps from 'utils/api/format-server-props';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';
import Invite from 'components/event/Invite';
import CenteredSection from 'components/layout/CenteredSection';
import usePageViewTracking from 'utils/hooks/use-page-view-tracking';
import getOneYearAgo from 'utils/data/get-one-year-ago';

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
  // Track page views when the component mounts and when the route changes
  usePageViewTracking();

  const parsedEvent = parseResponseDateStrings(event) as PartialEvent;

  return (
    <Layout
      titleOverride={invitedByUser?.name ? event.name + ' - Respond to ' + invitedByUser.name.split(' ')[0] + "'s Invite" : event.name}
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
        organizers: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    });
    formatServerProps(event);

    // Create RSVPs for organizers who haven't RSVP'd yet
    if (event?.organizers?.length > 0) {
      for (const organizer of event.organizers) {
        // Check if the organizer already has an RSVP
        const hasRSVP = event.RSVPs.some(rsvp => rsvp.user?.id === organizer.id);

        // If not, create an RSVP with status "Going"
        if (!hasRSVP) {
          try {
            await prisma.eventRSVP.upsert({
              where: {
                userId_eventId: {
                  userId: organizer.id,
                  eventId: event.id,
                },
              },
              create: {
                eventId: event.id,
                userId: organizer.id,
                email: organizer.email || null,
                status: 'Going',
                eventDetailsEmailOptIn: true,
              },
              update: {
                status: 'Going',
                eventDetailsEmailOptIn: true,
              },
            });
          } catch (err) {
            console.error(`Error creating RSVP for organizer ${organizer.id} in event ${event.id}:`, err);
          }
          delete organizer.email;
        }
      }

      // Directly query RSVPs instead of fetching the entire event again
      const rsvps = await prisma.eventRSVP.findMany({
        where: { eventId: event.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              subscriptions: { where: { lastPaymentDate: { gte: getOneYearAgo() } }, take: 1, select: { lastPaymentDate: true, id: true } },
            },
          },
        },
      });
      formatServerProps(rsvps);
      event.RSVPs = rsvps;
    }

    let invitedByUser = null;
    if (u) {
      const user = await prisma.user.findFirst({ where: { id: Number(u) } });
      console.log('user', user);
      if (user?.id) invitedByUser = { id: user.id, name: user.name, image: user.image };
    }

    return { props: { event, invitedByUser, name: name || null, email: email || null } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { event: null as PartialEvent | null } };
}
