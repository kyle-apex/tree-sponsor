import React, { useState } from 'react';

import { GetServerSideProps } from 'next';
import { StoreProduct } from 'components/store/StoreProduct';
import { PartialStoreProduct } from 'interfaces';
import { Grid, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import RestrictSection from 'components/RestrictSection';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import AddEditStoreProductDialog from 'components/store/AddEditStoreProductDialog';
import AddIcon from '@mui/icons-material/Add';
import { useGet } from 'utils/hooks/use-get';
import SplitRow from 'components/layout/SplitRow';
import Link from 'next/link';
import axios from 'axios';

const MemberStore = () => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [currentProduct, setCurrentProduct] = useState<PartialStoreProduct | undefined>(undefined);
  const { data: products, isFetched, refetch } = useGet<PartialStoreProduct[]>('/api/store', 'storeProducts');

  const deleteProduct = async (id: number) => {
    await axios.delete(`/api/store/${id}`);
    refetch();
  };

  return (
    <Layout title='Shirts'>
      <SplitRow alignItems='center'>
        <Typography color='secondary' variant='h1'>
          TreeFolksYP Member Shirts
        </Typography>

        <RestrictSection accessType='hasShirtManagement'>
          <IconButton
            onClick={() => {
              setCurrentProduct({});
              setIsOpen(true);
            }}
            size='medium'
          >
            <AddIcon></AddIcon>
          </IconButton>
          {currentProduct && (
            <AddEditStoreProductDialog
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              currentProduct={currentProduct}
              onComplete={refetch}
            ></AddEditStoreProductDialog>
          )}
        </RestrictSection>
      </SplitRow>
      <Typography variant='body1' mb={2}>
        Clicking &quot;Order&quot; will take you to Printful to select your size and shipping address.{' '}
      </Typography>
      <Typography variant='body1' mb={2}>
        The website will show a price, but after calculating shipping will show &quot;This order will be paid by the owner of the product
        template,&quot; so you do not need to enter credit card information.
      </Typography>

      <Typography variant='body1' mb={2}>
        After submitting, your order will ship after admin approval. If approval takes more than a day or two, please contact
        yp@treefolks.org.
      </Typography>
      <Typography variant='body1' mb={2}>
        If you, or a friend, would like a shirt beyond the free shirt that comes with your membership, you can order shirts at{' '}
        <a target='_blank' href='https://shop.tfyp.org' rel='noopener noreferrer'>
          https://shop.tfyp.org
        </a>
      </Typography>

      <Grid container>
        {products?.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <StoreProduct
              product={product}
              onEdit={() => {
                setCurrentProduct(product);
                setIsOpen(true);
              }}
              onDelete={() => {
                deleteProduct(product.id);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default MemberStore;
