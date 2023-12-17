import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import ImageSelector from 'components/ImageSelector';
import { PartialSpeciesSuggestion } from 'interfaces';
import { useEffect, useRef, useState } from 'react';
import SpeciesSelector from './SpeciesSelector';
import SpeciesSuggestion from './SpeciesSuggestion';
import SuggestSpeciesLoading from './SuggestSpeciesLoading';

const SuggestSpecies = ({
  imageContent,
  speciesId,
  onSelect,
  maxSuggestions = 10,
}: {
  imageContent?: string;
  speciesId?: number;
  onSelect?: (speciesId: number) => void;
  maxSuggestions?: number;
}) => {
  const [suggestions, setSuggestions] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);
  const [secondaryImageContent, setSecondaryImageContent] = useState('');
  const [previousImageContent, setPreviousImageContent] = useState('');
  const imageSelectorRef = useRef<React.ElementRef<typeof ImageSelector>>();

  const getIdentitySuggestions = async (imageContent: string) => {
    setIsLoading(true);
    if (imageContent != previousImageContent) setSecondaryImages([]);
    setPreviousImageContent(imageContent);
    const { data: results } = await axios.post('/api/species/suggest', { imageContent, secondaryImages });
    setSuggestions(results);
    setIsLoading(false);
  };
  useEffect(() => {
    if (imageContent && !imageContent.startsWith('http')) {
      getIdentitySuggestions(imageContent);
    }
  }, [imageContent, secondaryImages]);
  useEffect(() => {
    setSecondaryImages([secondaryImageContent]);
  }, [secondaryImageContent]);
  return (
    <>
      {onSelect && (
        <Typography mt={3}>
          {isLoading ? 'Or by clicking a recommendation: (this may take 10-15 seconds)' : 'Or by clicking a recommendation:'}
        </Typography>
      )}
      {suggestions?.length > 0 && !isLoading && suggestions[0].probability < 0.75 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant='caption' sx={{ display: 'inline' }} color='gray'>
            Uploading a secondary picture may provide a more confident suggestion.
          </Typography>
          <Typography variant='caption' sx={{ display: 'inline', ml: 0.5, cursor: 'pointer' }} color='primary'>
            <ImageSelector
              setImageUrl={setSecondaryImageContent}
              imageUrl={secondaryImageContent}
              ref={imageSelectorRef}
              sx={{ display: 'inline' }}
            >
              Click here to add another picture.
            </ImageSelector>
          </Typography>
        </Box>
      )}
      <List>
        {!isLoading &&
          suggestions?.slice(0, maxSuggestions).map(suggestion => {
            return (
              <SpeciesSuggestion
                key={suggestion?.id}
                isSelected={speciesId == suggestion.speciesId}
                suggestion={suggestion}
                onClick={onSelect}
              ></SpeciesSuggestion>
            );
          })}
        {isLoading && <SuggestSpeciesLoading />}
      </List>
    </>
  );
};
export default SuggestSpecies;
