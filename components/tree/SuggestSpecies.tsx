import List from '@mui/material/List';
import axios from 'axios';
import { PartialSpeciesSuggestion } from 'interfaces';
import { useEffect, useState } from 'react';
import SpeciesSelector from './SpeciesSelector';
import SpeciesSuggestion from './SpeciesSuggestion';

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
  const getIdentitySuggestions = async (imageContent: string) => {
    console.log('imageContent', imageContent);
    const { data: results } = await axios.post('/api/species/suggest', { imageContent });
    console.log('results', results);
    setSuggestions(results);
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
      <List>
        {suggestions?.map(suggestion => {
          return (
            <SpeciesSuggestion
              key={suggestion?.id}
              isSelected={speciesId == suggestion.speciesId}
              suggestion={suggestion}
              onClick={onSelect}
            ></SpeciesSuggestion>
          );
        })}
      </List>
    </>
  );
};
export default SuggestSpecies;
