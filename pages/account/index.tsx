import Layout from 'components/layout/Layout';

import Subscriptions from 'components/account/subscriptions/Subscriptions';
import Sponsorships from 'components/account/sponsorships/Sponsorships';

const AccountPage = () => {
  return (
    <Layout title='Account'>
      <h1>Account</h1>
      <Subscriptions></Subscriptions>
      <Sponsorships></Sponsorships>
    </Layout>
  );
};

export default AccountPage;
