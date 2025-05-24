import getOneYearAgo from '../utils/data/get-one-year-ago';

export function getUserDisplaySelect() {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return {
    id: true,
    name: true,
    image: true,
    displayName: true,
    profilePath: true,
    email: true,
    email2: true,
    hideFromCheckinPage: true,
    roles: {},
    profile: { select: { instagramHandle: true, linkedInLink: true, twitterHandle: true, organization: true, bio: true } },
    subscriptions: { where: { lastPaymentDate: { gt: oneYearAgo } }, select: { lastPaymentDate: true, createdDate: true } },
    referredUsers: { select: { id: true } },
  };
}

/**
 * Returns the common user selection pattern used in event RSVPs
 */
export function getRsvpUserSelect() {
  return {
    select: {
      name: true,
      image: true,
      id: true,
      subscriptions: {
        where: { lastPaymentDate: { gte: getOneYearAgo() } },
        take: 1,
        select: { lastPaymentDate: true, id: true },
      },
    },
  };
}
