import { useGet } from 'utils/hooks/use-get';
import { useUpdateQueryById } from 'utils/hooks/use-update-query-by-id';
import { Coordinate, PartialTree } from 'interfaces';
import { useCallback, useEffect, useRef, useState } from 'react';
import MapMarkerDisplay from 'components/maps/MapMarkerDisplay';
import Box from '@mui/material/Box';
import TreeDisplayDialog from 'components/tree/TreeDisplayDialog';
import useLocalStorage from 'utils/hooks/use-local-storage';
import QuizContext from 'components/tree/QuizContext';
import Skeleton from '@mui/material/Skeleton';

const handleUpdate = async (id: number, attributes: any) => {
  console.log('id', id, attributes);
};

const TreeIdQuiz = ({
  eventId,
  isRefreshing,
  setIsRefreshing,
  defaultLatitude,
  defaultLongitude,
  mapHeight = '200px',
  showLocation,
}: {
  eventId?: number;
  isRefreshing?: boolean;
  setIsRefreshing?: (val: boolean) => void;
  defaultLatitude?: number;
  defaultLongitude?: number;
  mapHeight?: string;
  showLocation?: boolean;
}) => {
  const [email] = useLocalStorage('checkinEmail', '');
  const currentMapCoordinateRef = useRef<Coordinate>(null);

  const latitude = currentMapCoordinateRef?.current?.latitude || defaultLatitude;
  const longitude = currentMapCoordinateRef?.current?.longitude || defaultLongitude;

  const {
    data: trees,
    isFetching,
    refetch,
    isFetched,
  } = useGet<PartialTree[]>(`/api/trees/for-coordinate`, 'trees', {
    latitude,
    longitude,
    email,
  });
  const [selectedTree, setSelectedTree] = useState<PartialTree>();
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleTreeClick = useCallback(
    (marker: Coordinate) => {
      const tree = trees.find(tree => Number(tree.latitude) == marker.latitude && Number(tree.longitude) == marker.longitude);
      setSelectedTree(tree);
      setIsQuizDialogOpen(true);
    },
    [trees],
  );

  const refresh = useCallback(async () => {
    await refetch();
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    if (isRefreshing) refresh();
  }, [isRefreshing]);

  useEffect(() => {
    currentMapCoordinateRef.current = { latitude: defaultLatitude, longitude: defaultLongitude };
  }, [defaultLatitude, defaultLongitude]);

  const onViewportChange = (viewport: any) => {
    console.log('viewport', viewport);
    if (showLocation) currentMapCoordinateRef.current = { latitude: viewport.latitude, longitude: viewport.longitude };
  };

  //const { remove } = useRemoveFromQuery(['attendees', { searchString }], handleDelete, true);

  const { updateById: updateTreeById } = useUpdateQueryById(
    [
      'trees',
      {
        latitude,
        longitude,
        email,
      },
    ],
    handleUpdate,
    true,
  );
  return (
    <QuizContext.Provider value={{ updateTreeById, trees }}>
      <Box>
        <TreeDisplayDialog tree={selectedTree} open={isQuizDialogOpen} setOpen={setIsQuizDialogOpen} eventId={eventId}></TreeDisplayDialog>
        {isFetched && (
          <MapMarkerDisplay
            markers={trees?.map(tree => {
              let isQuizCorrect;
              if (tree.speciesQuizResponses?.length > 0) {
                const quizResponse = tree.speciesQuizResponses[0];
                isQuizCorrect = quizResponse.isCorrect === true;
              }
              return { latitude: Number(tree.latitude), longitude: Number(tree.longitude), isQuizCorrect };
            })}
            height={mapHeight}
            onClick={coordinate => {
              handleTreeClick(coordinate);
            }}
            mapStyle='SATELLITE'
            markerScale={0.5}
            isQuiz={true}
            defaultLatitude={latitude}
            defaultLongitude={longitude}
            defaultZoom={17}
            showLocation={showLocation}
            onViewportChange={onViewportChange}
          ></MapMarkerDisplay>
        )}
        {!isFetched && (
          <Skeleton variant='rectangular' sx={{ width: '100%', borderRadius: '12px' }} height={Number(mapHeight.replace('px', ''))} />
        )}
      </Box>
    </QuizContext.Provider>
  );
};
export default TreeIdQuiz;
