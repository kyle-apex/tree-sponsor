// TODO
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SplitRow from 'components/layout/SplitRow';
import { PartialCategory } from 'interfaces';
import { useEffect, useState } from 'react';
import DeleteIconButton from 'components/DeleteIconButton';

import { useGet } from 'utils/hooks';
import CategorySelector from './CategorySelector';
const CategoryMultiSelect = ({
  selectedCategories,
  onAdd,
  onDelete,
  onUpdated,
  label = 'Category',
  hasAdd,
}: //setSelectedCategories,
{
  selectedCategories: PartialCategory[];
  onAdd?: (userId: number) => Promise<void>;
  onDelete?: (userId: number) => Promise<void>;
  onUpdated?: (categories: PartialCategory[]) => void;
  label?: string;
  hasAdd?: boolean;
  //setSelectedCategories: (category: PartialCategory[]) => void;
}) => {
  const [categoryList, setCategoryList] = useState<PartialCategory[]>(selectedCategories);

  const [isLoading, setIsLoading] = useState(false);
  const handleSelection = async (category: PartialCategory) => {
    setIsLoading(true);
    let newList;
    if (!categoryList) newList = [category];
    else newList = [...categoryList, category];
    setCategoryList(newList);
    if (onUpdated) onUpdated(newList);
    if (onAdd) await onAdd(category.id);
    setIsLoading(false);
  };
  const handleDelete = async (userId: number) => {
    setIsLoading(true);
    setCategoryList(list => {
      let newList: PartialCategory[];
      if (!list) newList = [];
      else newList = list.filter(user => user.id != userId);
      if (onUpdated) onUpdated(newList);
      return newList;
    });
    if (onDelete) await onDelete(userId);
    setIsLoading(false);
  };

  useEffect(() => {
    setCategoryList(currentList => {
      return !currentList ? selectedCategories : currentList;
    });
  }, [selectedCategories]);
  return (
    <>
      <Typography variant='h2' color='secondary'>
        Categories
      </Typography>
      {categoryList?.length > 0 && (
        <Box mb={1}>
          {categoryList?.map(category => {
            return (
              <SplitRow mb={1.5} key={category.id}>
                {category.name}
                <DeleteIconButton
                  itemType='category'
                  title='Remove Category?'
                  onDelete={() => handleDelete(category.id)}
                ></DeleteIconButton>
              </SplitRow>
            );
          })}
        </Box>
      )}
      <CategorySelector hasAdd={hasAdd} label={label} sx={{ mt: 1 }} isLoading={isLoading} onSelect={handleSelection}></CategorySelector>
    </>
  );
};
export default CategoryMultiSelect;
