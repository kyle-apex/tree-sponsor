import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { useState } from 'react';
import { SxProps, Theme } from '@mui/material/styles';

const LogoMessage = ({
  children,
  hideLogo,
  justifyContent = 'center',
  isCheckin,
  maxWidth = 'xs',
  sx = {},
}: {
  children: React.ReactNode;
  hideLogo?: boolean;
  justifyContent?: string;
  isCheckin?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  sx?: SxProps<Theme>;
}) => {
  const [isQrMode, setIsQrMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <Container
      maxWidth={maxWidth}
      sx={{
        minHeight: 'calc(100vh - 185px)',
        marginBottom: 0,
        display: 'flex',
        paddingRight: 0,
        paddingLeft: 0,
        ...sx,
      }}
    >
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
            <>
              <Box
                className='center'
                m={3}
                onClick={() => {
                  if (isCheckin) setIsQrMode((current: boolean) => !current);
                }}
              >
                {isQrMode ? (
                  <Image
                    src='/qr-checkin.png'
                    alt='TreeFolks Young Professionals Logo'
                    onLoadingComplete={() => setIsLoaded(true)}
                    width={100}
                    height={100}
                  />
                ) : (
                  <Image
                    src='/logo.png'
                    onLoadingComplete={() => setIsLoaded(true)}
                    alt='TreeFolks Young Professionals Logo'
                    width={100}
                    height={100}
                  />
                )}
                {isLoaded && isCheckin && (
                  <Box sx={{ textAlign: 'center', fontSize: '10px', color: '#4B7769', marginTop: '-4px' }}>
                    {isQrMode ? 'Scan to Share' : 'Tap for QR Code'}
                  </Box>
                )}
              </Box>
            </>
          )}
          {children}
        </Box>
      </Box>
    </Container>
  );
};

export default LogoMessage;
