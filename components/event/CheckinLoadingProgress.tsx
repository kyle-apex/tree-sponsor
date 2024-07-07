import { CircularProgress, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState, useEffect } from 'react';
import RotateRightIcon from '@mui/icons-material/RotateRight';
type Step = {
  text: string;
  duration: number;
  status: string;
  secondaryText?: string;
  completedText?: string;
  secondaryDuration?: number;
};

const initSteps: Step[] = [
  {
    text: 'Getting TreeFolksYP membership status',
    duration: 5000,
    status: 'In Progress',
  },
  {
    text: 'Loading tree information',
    duration: 5000,
    status: 'Waiting',
    completedText: 'Tree ID guessing game loaded',
  },
  {
    text: 'Loading event details',
    duration: 5000,
    status: 'Waiting',
    completedText: 'Event details loaded',
    secondaryDuration: 1000,
  },
];

const CheckinLoadingProgress = ({
  onComplete,
  isMember,
  activeMemberCount,
}: {
  onComplete: () => void;
  isMember?: boolean | null | undefined;
  activeMemberCount?: number;
}) => {
  const [steps, setSteps] = useState(initSteps);

  const processSteps = () => {
    let isComplete = true;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.status == 'In Progress') {
        step.status = 'Completed';

        if (i < steps.length - 1) {
          const nextStep = steps[i + 1];
          if (nextStep.status == 'Waiting') nextStep.status = 'In Progress';
          isComplete = false;
          setTimeout(() => {
            processSteps();
          }, nextStep.duration);
        } else if (step.secondaryDuration) {
          isComplete = false;
          setTimeout(() => {
            processSteps();
          }, step.secondaryDuration);
        }
        break;
      }
    }
    if (isComplete && onComplete) {
      onComplete();
    }
    console.log('steps', JSON.stringify(steps));
    setSteps([...steps]);
  };

  useEffect(() => {
    setTimeout(() => {
      processSteps();
    }, initSteps[0].duration);
  }, []);

  useEffect(() => {
    if (isMember === false || isMember === true) {
      const completedText = isMember ? 'Thanks for your Supporting Membership' : 'No membership found... yet!';
      setSteps(steps => {
        steps[0].completedText = completedText;
        return [...steps];
      });
    }
  }, [isMember]);

  return (
    <Box sx={{ height: '100%', width: '100%', mt: -1 }}>
      {steps.map(step => {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'row', fontSize: '80%', alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 30px', paddingTop: '3px' }}>
              {step.status == 'Completed' && <CheckCircleOutlineIcon color='primary' sx={{ fontSize: '120%' }}></CheckCircleOutlineIcon>}
              {step.status == 'In Progress' && (
                <RotateRightIcon color='secondary' sx={{ fontSize: '120%' }} className='spin'></RotateRightIcon>
              )}
              {step.status == 'Waiting' && (
                <RadioButtonUncheckedIcon sx={{ fontSize: '120%' }} color='secondary'></RadioButtonUncheckedIcon>
              )}
            </Box>
            <Box sx={{ flex: '1 1 100%', opacity: step.status == 'Waiting' ? 0.6 : 1 }}>
              {step.status == 'Completed' && step.completedText ? step.completedText : step.text}
            </Box>
          </Box>
        );
      })}
      <Box sx={{ mt: 1.5, mb: 1, textAlign: 'center', fontStyle: 'italic', fontSize: '1.5rem' }} className='pulse'>
        Did you know?
      </Box>
      <Typography sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '3rem', mb: 1 }} color='secondary'>
        {activeMemberCount}
      </Typography>
      <Typography sx={{ textAlign: 'center', color: 'gray', fontWeight: 'bold', fontSize: '16px', mt: '-16px' }}>
        TreeFolksYP Supporting Members
      </Typography>
      <Box sx={{ textAlign: 'center', fontSize: '14px', color: 'gray' }}>
        contribute toward planting trees around Austin with a donation starting at $20/year?
      </Box>
    </Box>
  );
};

export default CheckinLoadingProgress;
