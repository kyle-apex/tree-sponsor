import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { PartialSpeciesSuggestion } from 'interfaces';
import { useEffect, useState } from 'react';
import SpeciesSelector from './SpeciesSelector';
import SpeciesSuggestion from './SpeciesSuggestion';
import SuggestSpeciesLoading from './SuggestSpeciesLoading';

const SuggestSpecies = ({
  imageContent,
  speciesId,
  onSelect,
}: {
  imageContent?: string;
  speciesId?: number;
  onSelect?: (speciesId: number) => void;
}) => {
  const [suggestions, setSuggestions] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(false);
  const getIdentitySuggestions = async (imageContent: string) => {
    console.log('imageContent', imageContent);
    setIsLoading(true);
    const { data: results } = await axios.post('/api/species/suggest', { imageContent });
    console.log('results', results);
    setSuggestions(results);
    setIsLoading(false);
  };
  useEffect(() => {
    if (imageContent && !imageContent.startsWith('http')) {
      getIdentitySuggestions(imageContent);
    }
  }, [imageContent]);
  // top: picture
  // manual selector with top three choices sorted
  // list of suggestions with percentage... maybe 3?
  // back/next button
  return (
    <>
      <Typography mt={3}>
        {isLoading ? 'Or by clicking a recommendation: (this may take 10-15 seconds)' : 'Or by clicking a recommendation:'}
      </Typography>
      <List>
        {!isLoading &&
          suggestions?.map(suggestion => {
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
