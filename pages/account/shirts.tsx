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

const MemberStore = () => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<PartialStoreProduct | undefined>(undefined);
  const { data: products, isFetched, refetch } = useGet<PartialStoreProduct[]>('/api/store', 'storeProducts');

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

      <Grid container>
        {products?.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <StoreProduct
              product={product}
              onEdit={() => {
                setCurrentProduct(product);
                setIsOpen(true);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default MemberStore;
