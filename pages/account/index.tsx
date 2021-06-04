import Layout from 'components/layout/Layout';

import Subscriptions from 'components/account/subscriptions/Subscriptions';

const AccountPage = () => {
  return (
    <Layout title='Account'>
      <h1>Account</h1>
      <Subscriptions></Subscriptions>
    </Layout>
  );
};

export default AccountPage;
