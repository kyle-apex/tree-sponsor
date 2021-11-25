import { NextSession } from 'interfaces';
import UserAvatar from './sponsor/UserAvatar';

const SessionAvatar = ({ session, size }: { session: NextSession; size?: number }): JSX.Element => {
  return <UserAvatar image={session.user?.image} name={session.user?.name} size={size} />;
};
export default SessionAvatar;
