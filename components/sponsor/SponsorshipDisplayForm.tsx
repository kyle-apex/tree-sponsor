import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import React from 'react';
import { useSession } from 'next-auth/client';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import { UserAvatar, SponsorshipSubTitle } from 'components/sponsor';
import { DESCRIPTION_PLACEHOLDER, DEFAULT_TITLE_PREFIX } from 'consts';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import SpeciesSelector from 'components/tree/SpeciesSelector';

const SponsorshipDisplayForm = ({
  title,
  setTitle,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
  isPrivate,
  setIsPrivate,
  isPrivateLocation,
  setIsPrivateLocation,
}: {
  title: string;
  setTitle: (param: string) => void;
  description: string;
  setDescription: (param: string) => void;
  isPrivate: boolean;
  setIsPrivate: (param: boolean) => void;
  isPrivateLocation: boolean;
  setIsPrivateLocation: (param: boolean) => void;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [session] = useSession();

  const startDate = new Date();

  const getName = (): string => {
    return session?.user?.name ? session.user.name.split(' ')[0] : 'Anonymous';
  };

  return (
    <>
      <Card>
        <CardHeader
          avatar={<UserAvatar image={session?.user?.image} name={session?.user?.name} />}
          title={
            <TextField
              size='small'
              placeholder={DEFAULT_TITLE_PREFIX + getName()}
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='full-width'
            ></TextField>
          }
          subheader={<SponsorshipSubTitle startDate={startDate} />}
        />

        <CardMedia
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f1f1f1',
            cursor: 'pointer',
            minHeight: '200px',
          }}
          component='div'
          title='Click to Update Image'
        >
          <ImageUploadAndPreview imageUrl={imageUrl} setImageUrl={setImageUrl} />
        </CardMedia>

        <CardContent>
          <TextField
            multiline={true}
            rows={3}
            value={description}
            onChange={e => {
              setDescription(e.target.value);
            }}
            placeholder={DESCRIPTION_PLACEHOLDER}
            className='full-width'
          ></TextField>

          {!isPrivate && (
            <Box sx={{ marginTop: 2, marginBottom: -2 }}>
              <Checkbox checked={isPrivateLocation} onChange={e => setIsPrivateLocation(e.target.checked)}></Checkbox> Hide location from
              public view
            </Box>
          )}

          <Box sx={{ marginTop: 2, marginBottom: -2 }}>
            <Checkbox checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)}></Checkbox> Hide entirely from public view
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default SponsorshipDisplayForm;
