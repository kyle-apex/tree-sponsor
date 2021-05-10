import Layout from 'components/layout/Layout';

import Subscriptions from 'components/account/subscriptions/Subscriptions';

const AccountPage = () => {
  return (
    <Layout title='Account'>
      <h1>Hello Next.js 👋</h1>
      <p className='red-text'>red text</p>
      <Subscriptions></Subscriptions>
    </Layout>
  );
};

export default AccountPage;
