import Layout from '../components/layout/Layout';
import { useEffect, useState } from 'react';
import { PartialUser } from 'interfaces';
import { PartialSponsorship } from 'interfaces';
import { TREE_BENEFITS } from 'consts';
import { getCoreTeamBios } from 'utils/user/get-core-team-bios';
import parsedGet from 'utils/api/parsed-get';

// Import refactored components
import IntroSection from 'components/index/IntroSection';
import TreeBenefitsSection from 'components/index/TreeBenefitsSection';
import UpcomingEventsSection from 'components/index/UpcomingEventsSection';
import MembershipSection from 'components/index/MembershipSection';
import CoreTeamSection from 'components/index/CoreTeamSection';
import Box from '@mui/material/Box';

const IndexPage = ({
  stripePriceIdLow,
  stripePriceIdMedium,
  stripePriceIdHigh,
  users,
}: {
  stripePriceIdLow: string;
  stripePriceIdMedium: string;
  stripePriceIdHigh: string;
  users: PartialUser[];
}) => {
  const [sponsorships, setSponsorships] = useState<PartialSponsorship[]>([]);
  const [isLoadingSponsorships, setIsLoadingSponsorships] = useState(false);

  const getSponsorships = async () => {
    setIsLoadingSponsorships(true);
    const results = await parsedGet<PartialSponsorship[]>('sponsorships/home');
    setSponsorships(results);
    setIsLoadingSponsorships(false);
  };

  useEffect(() => {
    getSponsorships();
  }, []);

  return (
    <Layout isFullWidth={true}>
      {/* Introduction Section */}
      <IntroSection />

      {/* Upcoming Events Section */}
      <Box mb={3}>
        <UpcomingEventsSection />
      </Box>

      {/* Tree Benefits Section */}
      {false && <TreeBenefitsSection benefits={TREE_BENEFITS} />}

      {/* Membership Section */}
      <MembershipSection
        stripePriceIdHigh={stripePriceIdHigh}
        stripePriceIdLow={stripePriceIdLow}
        stripePriceIdMedium={stripePriceIdMedium}
      />

      {/* Core Team Section */}
      <CoreTeamSection users={users} />
    </Layout>
  );
};

export default IndexPage;
export async function getStaticProps() {
  const users = await getCoreTeamBios();
  return {
    props: {
      stripePriceIdLow: process.env.STRIPE_PRICE_ID_LOW || '',
      stripePriceIdMedium: process.env.STRIPE_PRICE_ID_MEDIUM || '',
      stripePriceIdHigh: process.env.STRIPE_PRICE_ID_HIGH || '',
      users,
    },
    revalidate: 60,
  };
}
