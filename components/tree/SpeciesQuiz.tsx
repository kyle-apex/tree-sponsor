import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { PartialSpecies, PartialTree, PartialSpeciesQuizResponse } from 'interfaces';
import { useEffect, useState } from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useGet } from 'utils/hooks/use-get';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import SpeciesDetails from './SpeciesDetails';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useContext } from 'react';
import QuizContext from './QuizContext';
import useLocalStorage from 'utils/hooks/use-local-storage';

const saveResponse = async (speciesQuizResponse: PartialSpeciesQuizResponse & { email: string }) => {
  await axios.post('/api/speciesQuizResponses', speciesQuizResponse);
};

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

const SpeciesQuiz = ({ correctSpecies, treeId, eventId }: { correctSpecies: PartialSpecies; treeId?: number; eventId?: number }) => {
  const [clickedSpeciesId, setClickedSpeciesId] = useState<number>(null);
  const [speciesOptions, setSpeciesOptions] = useState<PartialSpecies[]>([]);
  const { updateTreeById, trees } = useContext(QuizContext);
  const [email] = useLocalStorage('checkinEmail', '');

  const { data: prioritySpecies, isFetched } = useGet<PartialSpecies[]>(
    '/api/species/priority',
    'prioritySpecies',
    {},
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );

  useEffect(() => {
    setSpeciesOptions(getQuizOptions(prioritySpecies, correctSpecies));
  }, [correctSpecies?.id, prioritySpecies]);

  useEffect(() => {
    //console.log('treeId', treeId, trees);
    if (treeId && trees?.length > 0) {
      const tree = trees.find((tree: PartialTree) => tree.id == treeId);
      if (tree.speciesQuizResponses?.length > 0 && !clickedSpeciesId) {
        if (tree.speciesQuizResponses[0].isCorrect) setClickedSpeciesId(correctSpecies.id);
        else {
          // add the incorrect species to the list and select it
          if (tree.speciesQuizResponses[0].incorrectGuessName)
            setSpeciesOptions(options => [...options, { commonName: tree.speciesQuizResponses[0].incorrectGuessName, id: -1 }]);
          setClickedSpeciesId(-1);
        }
      }
    }
  }, [trees, treeId]);

  const handleClick = async (newlyClickedSpeciesId: number) => {
    if (clickedSpeciesId === null) {
      setClickedSpeciesId(newlyClickedSpeciesId);
      setTimeout(() => {
        document.getElementById('scroll-element').scrollIntoView({ behavior: 'smooth' });
      }, 100);
      const isCorrect = newlyClickedSpeciesId == correctSpecies.id;
      let incorrectGuessName;
      if (!isCorrect) incorrectGuessName = speciesOptions.find(species => species.id == newlyClickedSpeciesId)?.commonName;

      const response = { treeId, eventId, isCorrect, incorrectGuessName, email };
      await saveResponse(response);
      updateTreeById(treeId, { newResponse: response });
    }
  };
  if (clickedSpeciesId) {
    speciesOptions.sort((a, _b) => {
      return a.id == correctSpecies.id ? 1 : -1;
    });
  }
  return (
    <>
      {!clickedSpeciesId && (
        <Typography variant='body2' mt={-2} mb={2} sx={{ fontStyle: 'italic', textAlign: 'center', color: 'gray' }}>
          Click below to guess a species:
        </Typography>
      )}
      <Box id='scroll-element' sx={{ mt: -6, mb: 8 }}></Box>
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
              <HighlightOffIcon fontSize='small' sx={{ marginRight: '2px' }} />
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
