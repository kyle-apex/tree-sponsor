import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Attendee from 'components/event/Attendee';
import { LeaderRow, PartialUser } from 'interfaces';
import { useEffect } from 'react';
import LeaderTable from './LeaderTable';
import axios from 'axios';
import { useGet } from 'utils/hooks/use-get';

const TopIdentifiers = () => {
  //const [leaders, setLeaders] = useState<LeaderRow[]>();
  //const user: PartialUser = { name: 'Kyle', profile: { organization: 'American Airlines', instagramHandle: '@hoskinskyle' } };
  //const user2: PartialUser = { name: 'Dr. Miller', profile: { organization: 'The Vets?', instagramHandle: '@hoskinskyle' } };

  const { data: leaders, isFetching } = useGet<LeaderRow[]>('/api/leaders/top-identifiers', 'top-identifiers');

  return (
    <>
      <LeaderTable leaders={leaders} isFetching={isFetching}></LeaderTable>
    </>
  );
};
export default TopIdentifiers;
