import { PartialUser } from 'interfaces';

const Attendees = ({ count, users }: { count: number; users: PartialUser[] }) => {
  return <section>{count > 0 && <p>There are {count - 1} folks</p>}</section>;
};
export default Attendees;
