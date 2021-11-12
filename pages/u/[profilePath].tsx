import axios from 'axios';
import SponsorshipGroup from 'components/sponsor/SponsorshipGroup';
import { PartialSponsorship } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useLayoutEffect, useState } from 'react';
import parseResponseDateStrings from 'utils/api/parse-response-date-strings';

const UserProfilePage = ({ JSONSponsorships }: { JSONSponsorships: PartialSponsorship[] }) => {
  const router = useRouter();
  const { profilePath } = router.query;
  const [sponsorships, setSponsorships] = useState<PartialSponsorship[]>([]);

  useLayoutEffect(() => {
    parseResponseDateStrings(JSONSponsorships);
    setSponsorships(JSONSponsorships);
  }, JSONSponsorships);

  return (
    <>
      {profilePath}
      <SponsorshipGroup isLoading={false} sponsorships={sponsorships}></SponsorshipGroup>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { profilePath } = context.query;

  const results = await axios.get<PartialSponsorship[]>(process.env.URL + '/api/sponsorships/home');
  console.log('full results', results.data);
  // get user id
  return { props: { JSONSponsorships: results.data } };
}

export default UserProfilePage;
