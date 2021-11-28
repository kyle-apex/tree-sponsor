import { DEFAULT_TITLE_PREFIX } from 'consts';
import { PartialSponsorship } from 'interfaces';
import { getFirstName } from 'utils/user/get-first-name';

export const getDisplayTitle = (sponsorship: PartialSponsorship) => {
  return sponsorship.title || DEFAULT_TITLE_PREFIX + getFirstName(sponsorship.user);
};
