import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CheckinSessionContext } from 'components/event/CheckinSessionProvider';
import SplitRow from 'components/layout/SplitRow';
import LoadingButton from 'components/LoadingButton';
import { PartialStoreProduct } from 'interfaces';
import { useContext, useEffect, useState } from 'react';
import parsedGet from 'utils/api/parsed-get';
import AddEditStoreProductForm from './AddEditStoreProductForm';
import axios from 'axios';

const AddEditStoreProductDialog = ({
  isOpen,
  setIsOpen,
  currentProduct,
  onComplete,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentProduct: PartialStoreProduct;
  onComplete?: () => void;
}) => {
  const handleClose = () => {
    setIsOpen(false);
    if (onComplete) onComplete();
  };

  const [product, setProduct] = useState<PartialStoreProduct>(currentProduct);
  const [isLoading, setIsLoading] = useState(false);

  const updateAttribute = (attribute: string, value: any) => {
    setProduct(product => ({ ...product, [attribute]: value }));
  };

  useEffect(() => {
    setProduct(currentProduct);
  }, [currentProduct]);

  const save = async () => {
    setIsLoading(true);
    if (product.id) {
      await axios.patch(`/api/store/${product.id}`, product);
    } else await axios.post(`/api/store`, product);
    setIsLoading(false);
    if (onComplete) onComplete();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} sx={{ '& .MuiDialog-paperWidthSm': { maxWidth: '95%', width: '450px', margin: '0px' } }} onClose={handleClose}>
      <DialogTitle>{product?.id ? 'Edit' : 'Add'} Shirt</DialogTitle>
      <DialogContent className=''>
        <AddEditStoreProductForm product={product} updateAttribute={updateAttribute}></AddEditStoreProductForm>
        <SplitRow>
          <Button color='inherit' sx={{ mt: 3 }} onClick={handleClose}>
            Close
          </Button>
          <LoadingButton isLoading={isLoading} color='primary' sx={{ mt: 3 }} onClick={save}>
            Submit
          </LoadingButton>
        </SplitRow>
      </DialogContent>
    </Dialog>
  );
};
export default AddEditStoreProductDialog;
