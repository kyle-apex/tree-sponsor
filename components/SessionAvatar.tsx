import { NextSession } from 'interfaces';
import SponsorshipAvatar from './sponsor/SponsorshipAvatar';

const SessionAvatar = ({ session, size }: { session: NextSession; size?: number }): JSX.Element => {
  return <SponsorshipAvatar image={session.user.image} name={session.user.name} size={size} />;
};
export default SessionAvatar;
