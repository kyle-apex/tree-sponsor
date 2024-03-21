import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { makeStyles } from '@mui/styles';
import Link from 'next/link';
import { PartialStoreProduct } from 'interfaces';
import LoadingButton from 'components/LoadingButton';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import RestrictSection from 'components/RestrictSection';
import EditIcon from '@mui/icons-material/Edit';
import SplitRow from 'components/layout/SplitRow';
import Button from '@mui/material/Button';
import DeleteIconButton from 'components/DeleteIconButton';
import Box from '@mui/material/Box';

interface StoreProductProps {
  product: PartialStoreProduct;
  onEdit?: () => void;
  onDelete?: () => Promise<void>;
}

const useStyles = makeStyles({
  card: {
    width: 300,
    margin: 10,
  },
  media: {
    height: 300,
  },
  name: {
    height: 50,
  },
});

export const StoreProduct: React.FC<StoreProductProps> = ({ product, onEdit, onDelete }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <Link href={product.link}>
        <CardMedia className={classes.media} image={product.pictureUrl} title={product.name} />
      </Link>
      <CardContent>
        <SplitRow>
          <Link href={product.link}>
            <Typography className={classes.name} variant='h6'>
              {product.name}
            </Typography>
          </Link>
          <RestrictSection accessType='hasShirtManagement'>
            <Box>
              <IconButton
                onClick={() => {
                  onEdit();
                }}
                size='small'
              >
                <EditIcon sx={{ fontSize: '1.2rem' }}></EditIcon>
              </IconButton>
            </Box>
            <DeleteIconButton itemType='Shirt' onDelete={onDelete} />
          </RestrictSection>
        </SplitRow>
        <Link href={product.link}>
          <Button variant='outlined' color='primary' fullWidth>
            Order
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
