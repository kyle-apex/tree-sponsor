import { PartialUser } from 'interfaces';
import LeaderTable from './LeaderTable';

const TopQuizResponders = () => {
  const user: PartialUser = { name: 'Kyle', profile: { organization: 'American Airlines', instagramHandle: '@hoskinskyle' } };
  const user2: PartialUser = { name: 'Dr. Miller', profile: { organization: 'The Vets?', instagramHandle: '@hoskinskyle' } };

  return (
    <>
      <LeaderTable
        title='Tree ID Quiz Leaderboard'
        unit='# Correct'
        leaders={[
          { user: user2, position: 1, count: 11 },
          { user, position: 2, count: 7 },
        ]}
      ></LeaderTable>
    </>
  );
};
export default TopQuizResponders;
