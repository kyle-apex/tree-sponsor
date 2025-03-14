import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

const CenteredSection = ({
  children,
  backButtonText,
  headerText,
  maxWidth,
  sx,
}: {
  children: ReactNode;
  backButtonText?: string;
  headerText?: string;
  maxWidth?: string;
  sx?: SxProps<Theme>;
}) => {
  const router = useRouter();

  return (
    <Box
      className='section-background box-shadow'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: maxWidth || '500px',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderColor: theme => theme.palette.primary.main,
        borderRadius: '5px',
        border: 'solid 1px',
        padding: '10px 20px 30px',
        ...sx,
      }}
    >
      {backButtonText !== undefined && (
        <Button onClick={() => router.back()} variant='text' size='small' sx={{ marginBottom: 2, display: 'flex', alignSelf: 'start' }}>
          <ChevronLeftIcon /> {backButtonText ?? 'Back'}
        </Button>
      )}
      {headerText && (
        <Typography variant='h1' color='secondary' sx={{ marginBottom: 4 }}>
          {headerText}
        </Typography>
      )}
      {children}
    </Box>
  );
};
export default CenteredSection;
