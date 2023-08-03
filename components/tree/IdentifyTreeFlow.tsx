import React, { useState, useCallback, useRef, useContext, useEffect } from 'react';
import { PartialSpecies, PartialTree, PartialTreeImage } from 'interfaces';
import SplitRow from 'components/layout/SplitRow';
import LoadingButton from 'components/LoadingButton';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';

import axios from 'axios';
import AddTreeFormFields from './AddTreeFormFields';
import Box from '@mui/material/Box';
import LocationSelector from 'components/LocationSelector';
import getImageDimensions from 'utils/aws/get-image-dimensions';
import { IdentifyTreeContext } from './IdentifyTreeProvider';
import UploadLeaf from './UploadLeaf';
import ImageCropper, { FileBrowserHandle } from 'components/ImageCropper';
import SpeciesSelector from './SpeciesSelector';
import SuggestSpecies from './SuggestSpecies';
import { Crop } from 'react-image-crop';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import Typography from '@mui/material/Typography';
import useLocalStorage from 'utils/hooks/use-local-storage';
import Selector from 'components/Selector';
import UserSelector from 'components/UserSelector';
import { CheckinSessionContext } from 'components/event/CheckinSessionProvider';

const steps = [{ label: 'Identify' }, { label: 'Photograph' }, { label: 'Location' }];
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const IdentifyTreeFlow = ({ onComplete, longitude, latitude }: { onComplete?: () => void; longitude?: number; latitude?: number }) => {
  const { leafImage, setLeafImage, tree, setTree, reset } = useContext(IdentifyTreeContext);

  const [isUpserting, setIsUpserting] = useState(false);
  const isAwaitingUpload = useRef(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed] = useState<{ [k: number]: boolean }>({});
  const [imageUuid, setImageUuid] = useState('');
  const currentCrop = useRef<Crop>();
  const imageCropperRef = useRef<FileBrowserHandle>();
  const [isCropped, setIsCropped] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const imageRef = useRef<any>();
  const [email] = useLocalStorage('checkinEmail', '');
  const { sessionId, setSessionId } = useContext(CheckinSessionContext);

  // Helps delay saving tree while image upload is in progress
  const [saveDelayArgs, setSaveDelayArgs] = useState<Partial<{ step: number; isCompleted: boolean }>>();

  const handleChange = useCallback((propertyName: string, value: string | number) => {
    setTree((current: PartialTree) => {
      return { ...current, [propertyName]: value };
    });
  }, []);

  const upsertTree = async () => {
    if (!tree || !tree.pictureUrl) return;
    const { w, h } = await getImageDimensions(tree.pictureUrl);
    if (!tree.images?.length) tree.images = [{ url: tree.pictureUrl, width: w, height: h }];
    else tree.images = [{ ...tree.images[0], url: tree.pictureUrl, width: w, height: h }];

    if (leafImage) tree.images.push(leafImage);

    const data = { ...tree };
    // save space in the request by removing pictureUrl
    delete data.pictureUrl;

    const isNewTree = !data?.id;

    const updatedTreeResult = await axios.post('/api/trees', { tree: { ...data }, email, sessionId: sessionId });
    const updatedTree = updatedTreeResult.data;
    if (updatedTree?.id) handleChange('id', updatedTree.id);
    if (updatedTree.sessionId && isNewTree) setSessionId(updatedTree.sessionId, tomorrow);
    if (updatedTree?.pictureUrl) {
      handleChange('pictureUrl', updatedTree.pictureUrl);
    }
    if (updatedTree?.images) {
      setTree((current: PartialTree) => {
        return { ...current, images: updatedTree.images };
      });
      const updatedLeafImage = updatedTree.images.find((img: PartialTreeImage) => img.isLeaf);
      if (updatedLeafImage) setLeafImage(updatedLeafImage);
    }
  };

  const handleStep = (step: number) => () => {
    if (!(step == 1 && !tree?.speciesId)) setActiveStep(step);
  };

  const setCurrentCrop = (newCrop: Crop) => {
    currentCrop.current = newCrop;
  };

  const saveStep = async (step: number, isCompleted?: boolean) => {
    if (isCompleted) setIsCompleting(true);
    if (isAwaitingUpload.current) {
      // Delay saving tree while image upload is in progress
      setSaveDelayArgs({ step, isCompleted });
      return;
    }
    setActiveStep(step);
    setIsUpserting(true);
    isAwaitingUpload.current = true;
    await upsertTree();
    isAwaitingUpload.current = false;
    setIsUpserting(false);
    if (isCompleted) {
      setIsCompleting(false);
      reset();
    }
    if (onComplete && isCompleted) onComplete();
  };

  // Delay saving tree while image upload is in progress
  useEffect(() => {
    if (saveDelayArgs) {
      const saveDelayTimeout = setTimeout(() => {
        const step = saveDelayArgs.step;
        const isCompleted = saveDelayArgs.isCompleted;
        setSaveDelayArgs(null);
        saveStep(step, isCompleted);
      }, 400);

      return () => {
        clearTimeout(saveDelayTimeout);
      };
    }
  }, [saveDelayArgs, tree, leafImage]);

  const doCrop = async () => {
    const { base64Image, width, height } = imageCropperRef?.current?.doCrop();
    if (base64Image)
      setLeafImage((img: any) => {
        const updatedImage = { ...img, url: base64Image, width, height };
        return updatedImage;
      });

    setIsCropped(true);
  };

  return (
    <>
      <Stepper color='secondary' nonLinear sx={{ marginBottom: 3 }} activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step color='secondary' key={step.label} completed={completed[index]}>
            <StepButton color='secondary' onClick={handleStep(index)} disabled={index >= 1 && !!tree?.speciesId}>
              {step.label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ display: activeStep === 0 ? 'block' : 'none' }}>
        {!leafImage?.url && !isCropped && <Typography>Identify the tree by uploading a close up picture of a leaf:</Typography>}
        {!isCropped && (
          <Box sx={{ textAlign: 'center' }}>
            <ImageCropper
              imageUrl={leafImage?.url}
              setImageUrl={url => {
                setLeafImage((image: any) => {
                  return { ...image, url };
                });
              }}
              ref={imageCropperRef}
              imageRef={imageRef}
              addSubtitleText='Tap to add leaf picture'
              onCrop={newCrop => setCurrentCrop(newCrop)}
              previewSx={{ borderRadius: '50%', maxWidth: '100%', width: '200px', height: '200px', margin: '20px auto' }}
            ></ImageCropper>
          </Box>
        )}
        {isCropped && (
          <>
            <Typography mb={2}>Identify from the dropdown:</Typography>
            <Box sx={{ flexDirection: 'row', gap: 2, alignItems: 'center', display: 'flex' }}>
              {leafImage?.url && (
                <img
                  alt='Leaf Image'
                  src={leafImage?.url}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto', flex: '1 0 60px' }}
                ></img>
              )}
              <Box sx={{ flex: '1 1 100%' }}>
                <SpeciesSelector
                  defaultValue={tree?.speciesId}
                  onChange={speciesId => {
                    setTree((t: any) => {
                      return { ...t, speciesId };
                    });
                  }}
                ></SpeciesSelector>
              </Box>
            </Box>
            {leafImage?.url && (
              <>
                <SuggestSpecies
                  imageContent={leafImage?.url}
                  speciesId={tree?.speciesId}
                  onSelect={speciesId => {
                    setTree((t: any) => {
                      return { ...t, speciesId };
                    });
                  }}
                ></SuggestSpecies>
              </>
            )}
          </>
        )}
        <Box flexDirection='row' sx={{ justifyContent: 'space-between', display: 'flex' }} mt={3}>
          {onComplete ? (
            <Button
              disabled={isUpserting}
              color='inherit'
              onClick={() => {
                onComplete();
                reset();
              }}
            >
              Cancel
            </Button>
          ) : (
            <></>
          )}

          {!isCropped && (
            <Button
              color='primary'
              onClick={() => {
                setIsCropped(true);
                //setIsSkipped(true);
              }}
            >
              Skip
            </Button>
          )}
          {isCropped && (
            <Button
              color='primary'
              onClick={() => {
                setIsCropped(false);
                //setIsSkipped(false);
                setLeafImage(null);
              }}
            >
              Back
            </Button>
          )}
          {!isCropped && (
            <Button
              disabled={!leafImage?.url}
              variant='contained'
              color='primary'
              onClick={async () => {
                doCrop();
                //saveStep(activeStep + 1);
              }}
            >
              Crop
            </Button>
          )}
          {isCropped && (
            <Button
              disabled={!tree?.speciesId}
              variant='contained'
              color='primary'
              onClick={async () => {
                saveStep(activeStep + 1);
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
      <Box sx={{ display: activeStep === 1 ? 'block' : 'none' }}>
        <Box sx={{ mb: 3 }} className='box-shadow'>
          <ImageUploadAndPreview
            imageUrl={tree.pictureUrl}
            setImageUrl={(imageUrl: string) => {
              setTree((t: any) => {
                return { ...t, pictureUrl: imageUrl };
              });
            }}
            addSubtitleText='Add a picture of the full tree'
            previewHeight='250px'
          />
        </Box>
        <SplitRow>
          <Button
            color='inherit'
            onClick={() => {
              saveStep(activeStep - 1);
            }}
          >
            Back
          </Button>
          <Button
            disabled={!tree?.pictureUrl}
            variant='contained'
            color='primary'
            onClick={async () => {
              saveStep(activeStep + 1);
            }}
          >
            Continue
          </Button>
        </SplitRow>
      </Box>
      <Box sx={{ display: activeStep === 2 ? 'block' : 'none' }}>
        <Box sx={{ mb: 3 }}>
          <LocationSelector
            onViewportChange={({ latitude, longitude }) => {
              handleChange('latitude', latitude);
              handleChange('longitude', longitude);
            }}
            latitude={tree?.latitude ? Number(tree?.latitude) : latitude || null}
            longitude={tree?.longitude ? Number(tree?.longitude) : longitude || null}
            zoomToLocation={!tree?.latitude}
            mapStyle='SATELLITE'
          ></LocationSelector>
        </Box>
        <SplitRow>
          <Button
            disabled={isCompleting}
            color='inherit'
            onClick={() => {
              saveStep(activeStep - 1);
            }}
          >
            Back
          </Button>
          <LoadingButton
            disabled={isCompleting || !tree.pictureUrl}
            isLoading={isCompleting}
            variant='contained'
            color='primary'
            onClick={() => {
              saveStep(activeStep, true);
            }}
          >
            Save and Finish
          </LoadingButton>
        </SplitRow>
      </Box>
    </>
  );
};

export default IdentifyTreeFlow;
