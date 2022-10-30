import Checkin from 'components/event/Checkin';
import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';

const CheckinPage = () => {
  return (
    <Layout title='Event Checkin'>
      <LogoMessage justifyContent='start'>
        <Checkin />
      </LogoMessage>
    </Layout>
  );
};

export default CheckinPage;
