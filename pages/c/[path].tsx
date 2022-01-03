import axios from 'axios';
import { PartialCategory } from 'interfaces';
import { GetServerSidePropsContext } from 'next';
const CategoryPage = ({ category }: { category: PartialCategory }) => {
  console.log('category', category);
  return <>Category Page</>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { path } = context.query;

  try {
    const results = await axios.get(process.env.URL + '/api/categories/' + path);
    return { props: { category: results.data } };
  } catch (err) {
    console.log('err', err);
  }
  return { props: { category: null } };
}

export default CategoryPage;
