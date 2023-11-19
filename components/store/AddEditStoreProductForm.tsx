import TextField from '@mui/material/TextField';
import { PartialStoreProduct } from 'interfaces';

const AddEditStoreProductForm = ({
  product,
  updateAttribute,
}: {
  product: PartialStoreProduct;
  updateAttribute: (attribute: string, value: any) => void;
}) => {
  return (
    <>
      <TextField
        label='Name'
        value={product.name}
        onChange={event => updateAttribute('name', event.target.value)}
        fullWidth
        sx={{ marginBottom: 3, marginTop: 1 }}
      ></TextField>
      <TextField
        label='Link'
        value={product.link}
        onChange={event => updateAttribute('link', event.target.value)}
        fullWidth
        sx={{ marginBottom: 3 }}
      >
        {' '}
      </TextField>
      <TextField
        label='Picture URL'
        value={product.pictureUrl}
        onChange={event => updateAttribute('pictureUrl', event.target.value)}
        fullWidth
      ></TextField>
    </>
  );
};

export default AddEditStoreProductForm;
