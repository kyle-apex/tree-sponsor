import { LeaderRow } from 'interfaces';
import { useGet } from 'utils/hooks/use-get';
import LeaderTable from './LeaderTable';

const TopQuizResponders = () => {
  //const user: PartialUser = { name: 'Kyle', profile: { organization: 'American Airlines', instagramHandle: '@hoskinskyle' } };
  //const user2: PartialUser = { name: 'Dr. Miller', profile: { organization: 'The Vets?', instagramHandle: '@hoskinskyle' } };

  const { data: leaders, isFetching } = useGet<LeaderRow[]>('/api/leaders/top-quiz-responders', 'top-quiz-responders');

  return (
    <>
      <LeaderTable title='Tree ID Quiz Leaderboard' unit='Correct' leaders={leaders} isFetching={isFetching}></LeaderTable>
    </>
  );
};
export default TopQuizResponders;
