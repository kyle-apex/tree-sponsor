import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import MembershipStatus from 'components/MembershipStatus';

const MembershipStatusPage = () => {
  return (
    <Layout title='Membership Status'>
      <LogoMessage justifyContent='start'>
        <MembershipStatus />
      </LogoMessage>
    </Layout>
  );
};

export default MembershipStatusPage;
