import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { PartialSpecies, PartialTree, PartialSpeciesQuizResponse } from 'interfaces';
import { useEffect, useMemo, useState } from 'react';
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
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SxProps, Theme } from '@mui/material/styles';
import TreeIdHelpDialog from 'components/event/TreeIdHelpDialog';
import HintIcon from '@mui/icons-material/QuestionMark';
import FactIcon from '@mui/icons-material/PriorityHighOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import ClearIcon from '@mui/icons-material/Clear';
import SplitRow from 'components/layout/SplitRow';

const saveResponse = async (speciesQuizResponse: PartialSpeciesQuizResponse & { email: string }) => {
  if (speciesQuizResponse?.email) await axios.post('/api/speciesQuizResponses', speciesQuizResponse);
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
  //console.log('got quiz options', options);
  return options;
}

const SpeciesQuiz = ({
  correctSpecies,
  treeId,
  eventId,
  subtitleSx,
  hasLeaf,
  onClose,
  onNextTree,
}: {
  correctSpecies: PartialSpecies;
  treeId?: number;
  eventId?: number;
  subtitleSx?: SxProps<Theme>;
  hasLeaf?: boolean;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
  onNextTree?: (isPrev?: boolean) => void;
}) => {
  const [clickedSpeciesId, setClickedSpeciesId] = useState<number>(null);
  const [speciesOptions, setSpeciesOptions] = useState<PartialSpecies[]>([]);
  const { updateTreeById, trees, event } = useContext(QuizContext);
  const [email] = useLocalStorage('checkinEmail', '', 'checkinEmail2');
  const [isHintDialogOpen, setIsHintDialogOpen] = useState(false);

  const treeIndex = useMemo(() => {
    const tree = trees.find((t: PartialTree) => t.id == treeId);
    return trees.indexOf(tree);
  }, [trees, treeId]);

  const theme = useTheme();

  const isMobile = !useMediaQuery(theme.breakpoints.up(500));

  const isSmall = !useMediaQuery(theme.breakpoints.up(340)) && hasLeaf;

  const { data: prioritySpecies, isFetched } = useGet<PartialSpecies[]>(
    '/api/species/priority',
    'prioritySpecies',
    {},
    { refetchOnMount: false, refetchOnWindowFocus: false },
  );

  /*useEffect(() => {
    console.log('set from first one');
    
  }, [correctSpecies?.id, prioritySpecies]);
*/
  useEffect(() => {
    //console.log('treeId', treeId, trees);
    setSpeciesOptions(getQuizOptions(prioritySpecies, correctSpecies));
    if (treeId && trees?.length > 0) {
      const tree = trees.find((tree: PartialTree) => tree.id == treeId);
      //console.log('tree', treeId, tree, correctSpecies?.id);
      if (tree.speciesQuizResponses?.length > 0) {
        //} && (!clickedSpeciesId || clickedSpeciesId == -1)) {
        if (tree.speciesQuizResponses[0].isCorrect) setClickedSpeciesId(correctSpecies.id);
        else {
          // add the incorrect species to the list and select it
          //console.log('set from second one', tree.speciesQuizResponses[0].incorrectGuessName);
          if (tree.speciesQuizResponses[0].incorrectGuessName)
            setSpeciesOptions(options => [...options, { commonName: tree.speciesQuizResponses[0].incorrectGuessName, id: -1 }]);
          setClickedSpeciesId(-1);
        }
      }
    }
  }, [trees, treeId, correctSpecies?.id, prioritySpecies]);

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
      const tree = trees.find((tree: PartialTree) => tree.id == treeId) as PartialTree;
      tree.speciesQuizResponses = [response];
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
      <Box display='flex' justifyContent={hasLeaf || !onNextTree ? 'flex-start' : 'flex-start'} gap={1}>
        {onNextTree && event?.hasSpecificTrees ? (
          <>
            <Button
              variant='outlined'
              size='small'
              color='inherit'
              sx={{ width: '32px', minWidth: '20px', pr: 0, pl: 0 }}
              onClick={() => {
                onNextTree(true);
                setClickedSpeciesId(null);
              }}
            >
              <ChevronLeftIcon fontSize='small'></ChevronLeftIcon>
            </Button>
            <Button
              variant='outlined'
              size='small'
              color='inherit'
              sx={{ width: '50px', minWidth: '20px', pr: 0, pl: 0, textAlign: 'center' }}
              onClick={() => {
                onNextTree();
                setClickedSpeciesId(null);
              }}
            >
              {treeIndex + 1}/{trees?.length}
            </Button>
            <Button
              variant='outlined'
              size='small'
              color='inherit'
              sx={{ width: '32px', minWidth: '20px', pr: 0, pl: 0 }}
              onClick={() => {
                onNextTree();
                setClickedSpeciesId(null);
              }}
            >
              <ChevronRightIcon fontSize='small'></ChevronRightIcon>
            </Button>
          </>
        ) : (
          clickedSpeciesId && (
            <Button size='small' variant='outlined' color='inherit' sx={{ minWidth: '70px', mr: 0.5 }} onClick={onClose}>
              <ClearIcon sx={{ mr: 0.5 }} fontSize='small'></ClearIcon>Close
            </Button>
          )
        )}
      </Box>
      {!clickedSpeciesId ? (
        <Typography
          mb={2}
          variant='body1'
          mt={onNextTree && event?.hasSpecificTrees ? 2 : 0}
          sx={{ fontStyle: 'italic', textAlign: isMobile ? 'left' : 'center', color: 'gray', ...subtitleSx }}
        >
          Name that tree{!isSmall ? ' species' : ''}!
        </Typography>
      ) : (
        <></>
      )}
      <Box id='scroll-element' sx={{ mt: !clickedSpeciesId ? -6 : -6, mb: 8 }}></Box>

      {speciesOptions.map(species => {
        const color =
          clickedSpeciesId && (clickedSpeciesId == species.id || species.id == correctSpecies.id)
            ? species.id == clickedSpeciesId && species.id != correctSpecies.id
              ? 'error'
              : 'primary'
            : 'secondary';

        let icon;
        const isIncorrect = species?.id == clickedSpeciesId && species?.id != correctSpecies?.id;
        const isCorrect = species?.id == clickedSpeciesId && species?.id == correctSpecies?.id;

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
              className={isIncorrect ? 'shake box-shadow' : isCorrect ? 'grow box-shadow' : 'box-shadow'}
              color={color}
              disabled={clickedSpeciesId && color == 'secondary'}
              onClick={() => {
                handleClick(species.id);
              }}
              sx={{
                textTransform: 'none',
                fontWeight: color == 'primary' ? '600' : '',
                background:
                  color == 'secondary'
                    ? 'linear-gradient(to top, #6e48542b, #6e48541f),url(/background-lighter.svg)'
                    : color == 'primary'
                    ? 'linear-gradient(to top, #486e6242, #486e6233),url(/background-lighter.svg)'
                    : color == 'error'
                    ? 'linear-gradient(to top, #d32f2f30, #d32f2f1c),url(/background-lighter.svg)'
                    : '',
                color: color == 'primary' ? '#486e62' : color == 'error' ? '#d32f2f' : '',
                border: color == 'primary' ? 'solid 1px #486e62' : color == 'error' ? 'solid 1px' : '',
              }}
            >
              {icon}
              {clickedSpeciesId &&
                correctSpecies.id == species.id &&
                ['a', 'e', 'i', 'o', 'u'].includes(species.commonName.charAt(0).toLowerCase()) && <span>It&apos;s an</span>}
              {clickedSpeciesId &&
                correctSpecies.id == species.id &&
                !['a', 'e', 'i', 'o', 'u'].includes(species.commonName.charAt(0).toLowerCase()) && <span>It&apos;s a</span>}
              <span style={{ textTransform: 'capitalize', marginLeft: '5px' }}>{species.commonName}</span>
              {clickedSpeciesId && correctSpecies.id == species.id && '!'}
            </Button>
          </Box>
        );
      })}
      {clickedSpeciesId && (
        <>
          {trees?.length >= treeIndex && trees[treeIndex]?.funFact && (
            <Typography mb={1} variant='body1' mt={3}>
              Fun fact: {trees[treeIndex]?.funFact}
            </Typography>
          )}
          <SpeciesDetails species={correctSpecies}></SpeciesDetails>
        </>
      )}
      {!clickedSpeciesId && trees?.length >= treeIndex && trees[treeIndex]?.funFact && (
        <Box sx={{ fontSize: '0.875rem', textAlign: 'center', pt: 1, pb: 1, pl: 2.5, pr: 2, mb: 2 }} className='primary-info'>
          <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center', flexDirection: 'row' }}>
            <FactIcon></FactIcon> <Box sx={{ textAlign: 'left' }}>{trees[treeIndex]?.funFact}</Box>
          </Box>
        </Box>
      )}
      {!clickedSpeciesId && (
        <Box sx={{ fontSize: '0.875rem', textAlign: 'center', pt: 1, pb: 1, pl: 2.5, pr: 2 }} className='primary-info'>
          <a
            onClick={() => {
              setIsHintDialogOpen(true);
            }}
            style={{ cursor: 'pointer', marginBottom: 1, display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'end' }}
          >
            <HintIcon></HintIcon>{' '}
            <Box sx={{ textAlign: 'left' }}>Stumped? Click here to take a picture of a leaf for species suggestions</Box>
          </a>
          <TreeIdHelpDialog isOpen={isHintDialogOpen} setIsOpen={setIsHintDialogOpen}></TreeIdHelpDialog>
        </Box>
      )}
    </>
  );
};
export default SpeciesQuiz;
