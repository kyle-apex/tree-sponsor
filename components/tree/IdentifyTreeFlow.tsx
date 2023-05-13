import React, { useState, useCallback, useRef, useContext } from 'react';
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
import ImageCropper from 'components/ImageCropper';
import SpeciesSelector from './SpeciesSelector';
import SuggestSpecies from './SuggestSpecies';
import { Crop } from 'react-image-crop';
import ImageUploadAndPreview from 'components/ImageUploadAndPreview';
import Typography from '@mui/material/Typography';
import useLocalStorage from 'utils/hooks/use-local-storage';
import Selector from 'components/Selector';
import UserSelector from 'components/UserSelector';

const steps = [{ label: 'Identify' }, { label: 'Photograph' }, { label: 'Location' }];

const IdentifyTreeFlow = ({ onComplete, longitude, latitude }: { onComplete?: () => void; longitude?: number; latitude?: number }) => {
  const { leafImage, setLeafImage, tree, setTree, reset } = useContext(IdentifyTreeContext);

  const [isUpserting, setIsUpserting] = useState(false);
  const isAwaitingUpload = useRef(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [completed] = useState<{ [k: number]: boolean }>({});
  const [imageUuid, setImageUuid] = useState('');
  const currentCrop = useRef<Crop>();
  const [isCropped, setIsCropped] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);
  const imageRef = useRef<any>();
  const [email] = useLocalStorage('checkinEmail', '');

  const handleChange = useCallback((propertyName: string, value: string | number) => {
    setTree((current: PartialTree) => {
      return { ...current, [propertyName]: value };
    });
  }, []);

  const upsertTree = async () => {
    if (!tree || !tree.pictureUrl) return;
    const { w, h } = await getImageDimensions(tree.pictureUrl);
    if (!tree.images?.length) tree.images = [{ url: tree.pictureUrl, width: w, height: h }, leafImage];
    else tree.images = [{ ...tree.images[0], url: tree.pictureUrl, width: w, height: h }, leafImage];

    const data = { ...tree };
    // save space in the request by removing pictureUrl
    delete data.pictureUrl;
    const updatedTreeResult = await axios.post('/api/trees', { tree: { ...data }, email });
    const updatedTree = updatedTreeResult.data;
    if (updatedTree?.id) handleChange('id', updatedTree.id);
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
      setTimeout(() => {
        saveStep(step, isCompleted);
      }, 250);
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

  const doCrop = async () => {
    // create a canvas element to draw the cropped image
    const canvas = document.createElement('canvas');

    // get the image element
    const image = imageRef.current;
    const crop = currentCrop.current;

    // draw the image on the canvas
    if (image) {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      const pixelRatio = 1; //window.devicePixelRatio;
      canvas.width = crop.width * pixelRatio * scaleX;
      canvas.height = crop.height * pixelRatio * scaleY;

      if (ctx) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY,
        );
      }

      const base64Image = canvas.toDataURL('image/jpeg', 1); // can be changed to jpeg/jpg etc
      setLeafImage((img: any) => {
        const updatedImage = { ...img, url: base64Image, width: canvas.width, height: canvas.height };
        return updatedImage;
      });
    }

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
              imageRef={imageRef}
              addSubtitleText='Click to add leaf picture'
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
        <Box sx={{ mb: 3 }}>
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
