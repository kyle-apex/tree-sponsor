import axios from 'axios';
import Layout from 'components/layout/Layout';
import SponsorshipGroup from 'components/sponsor/SponsorshipGroup';
import { PartialSponsorship, PartialUser } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';

const UserProfilePage = ({ sponsorships, user }: { sponsorships?: PartialSponsorship[]; user: PartialUser }) => {
  const router = useRouter();
  const { profilePath } = router.query;
  parseResponseDateStrings(user.sponsorships);

  return (
    <Layout>
      {profilePath}
      <SponsorshipGroup isLoading={false} sponsorships={user.sponsorships}></SponsorshipGroup>
    </Layout>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { profilePath } = context.query;
  try {
    const results = await axios.get(process.env.URL + '/api/u/' + profilePath);
    return { props: { user: results.data } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { user: null } };
}

export default UserProfilePage;
