import { PartialCategory } from 'interfaces';
import { useGet } from 'utils/hooks';
const CategoryMultiSelect = ({
  selectedCategories,
  setSelectedCategories,
}: {
  selectedCategories: PartialCategory[];
  setSelectedCategories: (category: PartialCategory[]) => void;
}) => {
  const { data: categoryOptions } = useGet('/api/categories', 'categoryOptions');
  console.log('selectedCategories', selectedCategories, categoryOptions, setSelectedCategories);
  return <></>;
};
export default CategoryMultiSelect;
