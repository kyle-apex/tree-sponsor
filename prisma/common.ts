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
    subscriptions: { where: { lastPaymentDate: { gt: oneYearAgo } }, select: { lastPaymentDate: true } },
    referredUsers: { select: { id: true } },
  };
}
