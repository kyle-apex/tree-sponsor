import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { PartialSpecies } from 'interfaces';
import { useEffect, useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useGet } from 'utils/hooks/use-get';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import SpeciesDetails from './SpeciesDetails';
import Typography from '@mui/material/Typography';

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
    setTimeout(() => {
      document.getElementById('scroll-element').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  if (clickedSpeciesId) {
    speciesOptions.sort((a, _b) => {
      return a.id == correctSpecies.id ? 1 : -1;
    });
  }
  return (
    <>
      <Box id='scroll-element' sx={{ mt: -6, mb: 8 }}></Box>
      {!clickedSpeciesId && (
        <Typography variant='body2' mt={-2} mb={2} sx={{ fontStyle: 'italic', textAlign: 'center', color: 'gray' }}>
          Click below to guess a species:
        </Typography>
      )}
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

        if (clickedSpeciesId && !(clickedSpeciesId == species.id || species.id == correctSpecies.id)) return null;

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
              sx={{ textTransform: 'none' }}
            >
              {icon}
              {clickedSpeciesId &&
                correctSpecies.id == species.id &&
                ['a', 'e', 'i', 'o', 'u', 'y'].includes(species.commonName.charAt(0).toLowerCase()) && <span>It&apos;s an</span>}
              {clickedSpeciesId &&
                correctSpecies.id == species.id &&
                !['a', 'e', 'i', 'o', 'u', 'y'].includes(species.commonName.charAt(0).toLowerCase()) && <span>It&apos;s a</span>}
              <span style={{ textTransform: 'capitalize', marginLeft: '5px' }}>{species.commonName}</span>
              {clickedSpeciesId && correctSpecies.id == species.id && '!'}
            </Button>
          </Box>
        );
      })}
      {clickedSpeciesId && <SpeciesDetails species={correctSpecies}></SpeciesDetails>}
    </>
  );
};
export default SpeciesQuiz;
