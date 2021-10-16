import { SponsorshipAvatar } from './sponsor';
import { Session } from 'next-auth';

const SessionAvatar = ({ session, size }: { session: Session; size?: number }) => {
  return <SponsorshipAvatar image={session.user.image} name={session.user.name} size={size} />;
};
export default SessionAvatar;
