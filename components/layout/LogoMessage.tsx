import { Box, Container } from '@mui/material';
import React from 'react';
import Image from 'next/image';

const LogoMessage = ({ children, hideLogo }: { children: React.ReactNode; hideLogo?: boolean }) => {
  return (
    <Container maxWidth='xs' sx={{ minHeight: 'calc(100vh - 170px)', marginBottom: 0, display: 'flex' }}>
      <Box display='flex' justifyContent='center' alignItems='center' sx={{ width: '100%' }}>
        <Box
          flexDirection='column'
          display='flex'
          justifyContent='center'
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
