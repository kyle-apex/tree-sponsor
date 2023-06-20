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
  maxSuggestions = 10,
}: {
  imageContent?: string;
  speciesId?: number;
  onSelect?: (speciesId: number) => void;
  maxSuggestions?: number;
}) => {
  const [suggestions, setSuggestions] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(false);
  const getIdentitySuggestions = async (imageContent: string) => {
    setIsLoading(true);
    const { data: results } = await axios.post('/api/species/suggest', { imageContent });
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
      {onSelect && (
        <Typography mt={3}>
          {isLoading ? 'Or by clicking a recommendation: (this may take 10-15 seconds)' : 'Or by clicking a recommendation:'}
        </Typography>
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
