import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { PartialSpecies } from 'interfaces';
import { useEffect, useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useGet } from 'utils/hooks/use-get';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';

function getQuizOptions(species: PartialSpecies[], correctSpecies: PartialSpecies): PartialSpecies[] {
  const options: PartialSpecies[] = [];
  const correctIndex = Math.floor(Math.random() * 4);
  const usedIndexes: number[] = [];
  let randomIndex;
  if (!species?.length) return [];
  for (let i = 0; i < 4; i++) {
    if (i == correctIndex) options.push(correctSpecies);
    else {
      while (!randomIndex || usedIndexes.includes(randomIndex)) randomIndex = Math.floor(Math.random() * species.length) - 1;
      usedIndexes.push(randomIndex);
      options.push(species[randomIndex]);
    }
    randomIndex = null;
  }
  return options;
}

const SpeciesQuiz = ({ correctSpecies }: { correctSpecies: PartialSpecies }) => {
  const [clickedSpeciesId, setClickedSpeciesId] = useState<number>(null);
  const [speciesOptions, setSpeciesOptions] = useState<PartialSpecies[]>([]);
  const { data: prioritySpecies, isFetched } = useGet<PartialSpecies[]>(
    '/api/species/priority',
    'prioritySpecies',
    {},
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );

  useEffect(() => {
    setSpeciesOptions(getQuizOptions(prioritySpecies, correctSpecies));
  }, [correctSpecies?.id, prioritySpecies]);

  const handleClick = (newlyClickedSpeciesId: number) => {
    if (clickedSpeciesId === null) {
      setClickedSpeciesId(newlyClickedSpeciesId);
    }
  };
  return (
    <>
      {speciesOptions.map(species => {
        const color =
          clickedSpeciesId && (clickedSpeciesId == species.id || species.id == correctSpecies.id)
            ? species.id == clickedSpeciesId && species.id != correctSpecies.id
              ? 'error'
              : 'primary'
            : 'inherit';

        let icon;
        const isIncorrect = species.id == clickedSpeciesId && species.id != correctSpecies.id;
        const isCorrect = species.id == clickedSpeciesId && species.id == correctSpecies.id;

        if (species.id == clickedSpeciesId) {
          icon =
            species.id == correctSpecies.id ? (
              <Grow in={true} timeout={{ enter: 1200 }}>
                <Fade in={true} timeout={{ enter: 1200 }}>
                  <CheckCircleOutlineIcon sx={{ marginRight: 1 }} />
                </Fade>
              </Grow>
            ) : (
              <HighlightOffIcon sx={{ marginRight: 1 }} />
            );
        }

        const variant = clickedSpeciesId && (clickedSpeciesId == species.id || species.id == correctSpecies.id) ? 'contained' : 'outlined';

        return (
          <Box mb={2} key={species.id}>
            <Button
              fullWidth={true}
              variant={variant}
              className={isIncorrect ? 'shake' : isCorrect ? 'grow' : ''}
              color={color}
              disabled={clickedSpeciesId && color == 'inherit'}
              onClick={() => {
                handleClick(species.id);
              }}
            >
              {icon}
              {species.commonName}
            </Button>
          </Box>
        );
      })}
    </>
  );
};
export default SpeciesQuiz;
