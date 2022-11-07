import AddCategory from 'components/category/AddCategory';
import CenteredSection from 'components/layout/CenteredSection';
import Layout from 'components/layout/Layout';
import { PartialCategory } from 'interfaces';
const onAdd = (newCategory: PartialCategory) => {
  console.log('onAdd', newCategory);
};

const AddCategoryPage = () => {
  return (
    <Layout title='Add Category'>
      <CenteredSection backButtonText='Back' headerText='Add Category'>
        <AddCategory onAdd={onAdd}></AddCategory>
      </CenteredSection>
    </Layout>
  );
};
export default AddCategoryPage;
