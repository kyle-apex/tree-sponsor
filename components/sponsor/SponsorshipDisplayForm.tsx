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
import { PartialSponsorship } from 'interfaces';

const SponsorshipDisplayForm = ({
  sponsorship,
  imageUrl,
  setImageUrl,
}: {
  sponsorship: React.MutableRefObject<PartialSponsorship>;
  imageUrl: string;
  setImageUrl: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [session] = useSession();
  console.log('re-rendered');

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
              value={sponsorship.current.title}
              onChange={e => {
                sponsorship.current.title = e.target.value;
              }}
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
            value={sponsorship.current.description}
            onChange={e => {
              sponsorship.current.description = e.target.value;
            }}
            placeholder={DESCRIPTION_PLACEHOLDER}
            className='full-width'
          ></TextField>
          <Checkbox
            checked={sponsorship.current.isPrivate}
            onChange={e => {
              sponsorship.current.isPrivate = e.target.checked;
            }}
          ></Checkbox>{' '}
          Is Private?
        </CardContent>
      </Card>
    </>
  );
};

export default SponsorshipDisplayForm;
