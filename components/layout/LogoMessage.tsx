import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Image from 'next/image';

const LogoMessage = ({
  children,
  hideLogo,
  justifyContent = 'center',
}: {
  children: React.ReactNode;
  hideLogo?: boolean;
  justifyContent?: string;
}) => {
  return (
    <Container maxWidth='xs' sx={{ minHeight: 'calc(100vh - 185px)', marginBottom: 0, display: 'flex' }}>
      <Box display='flex' justifyContent='center' alignItems='center' sx={{ width: '100%' }}>
        <Box
          flexDirection='column'
          display='flex'
          justifyContent={justifyContent}
          className='box-shadow section-background'
          sx={{
            borderColor: theme => theme.palette.primary.main,
            borderRadius: '5px',
            border: 'solid 1px',
            padding: '10px 20px 30px',
            backgroundColor: 'white',
            minHeight: '380px',
            width: '100%',
          }}
        >
          {!hideLogo && (
            <Box className='center' m={3}>
              <Image src='/logo.png' alt='TreeFolks Young Professionals Logo' width={100} height={100} />
            </Box>
          )}
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default LogoMessage;
