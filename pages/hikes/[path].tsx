import Layout from 'components/layout/Layout';
import LogoMessage from 'components/layout/LogoMessage';
import TreeSequenceDisplay from 'components/treeGroup/TreeSequenceDisplay';
import { PartialTreeGroup } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
import formatServerProps from 'utils/api/format-server-props';

const HikePage = ({ group }: { group: PartialTreeGroup }) => {
  return (
    <Layout title='Name of Hike' header='TreeFolksYP'>
      <LogoMessage justifyContent='start' hideLogo={true}>
        <TreeSequenceDisplay treeGroupId={group.id} />
      </LogoMessage>
    </Layout>
  );
};
export default HikePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path } = context.query;

  try {
    const group = await prisma.treeGroup.findFirst({
      where: { path: path + '' },
    });
    formatServerProps(group);
    console.log('group', group);

    return { props: { group } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { group: null } };
}
