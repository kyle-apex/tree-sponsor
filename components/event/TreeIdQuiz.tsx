import { useGet } from 'utils/hooks/use-get';
import { useUpdateQueryById } from 'utils/hooks/use-update-query-by-id';
import { Coordinate, PartialEvent, PartialTree, QuizCoordinate } from 'interfaces';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import MapMarkerDisplay from 'components/maps/MapMarkerDisplay';
import Box from '@mui/material/Box';
import TreeDisplayDialog from 'components/tree/TreeDisplayDialog';
import useLocalStorage from 'utils/hooks/use-local-storage';
import QuizContext from 'components/tree/QuizContext';
import Skeleton from '@mui/material/Skeleton';
import PinIcon from '@mui/icons-material/LocationOn';

const handleUpdate = async (id: number, attributes: any) => {
  console.log('id', id, attributes);
};
export type TreeIdQuizHandle = {
  start: () => void;
};

const TreeIdQuiz = forwardRef(
  (
    {
      eventId,
      isRefreshing,
      setIsRefreshing,
      defaultLatitude,
      defaultLongitude,
      mapHeight = '200px',
      showLocation,
      onCloseDialog,
      categoryIds,
      onFetched,
      event,
    }: {
      eventId?: number;
      isRefreshing?: boolean;
      setIsRefreshing?: (val: boolean) => void;
      defaultLatitude?: number;
      defaultLongitude?: number;
      mapHeight?: string;
      showLocation?: boolean;
      onCloseDialog?: () => void;
      categoryIds?: number[];
      onFetched?: (trees: PartialTree[]) => void;
      event?: PartialEvent;
    },
    ref: React.Ref<TreeIdQuizHandle>,
  ) => {
    useImperativeHandle(ref, () => ({
      start() {
        setSelectedTree(trees[0]);
        setIsQuizDialogOpen(true);
      },
    }));

    const [email] = useLocalStorage('checkinEmail', '');
    const [markers, setMarkers] = useState<QuizCoordinate[]>();
    const currentMapCoordinateRef = useRef<Coordinate>(null);
    const [isFirstQuiz, setIsFirstQuiz] = useState(true);

    const latitude = currentMapCoordinateRef?.current?.latitude || defaultLatitude;
    const longitude = currentMapCoordinateRef?.current?.longitude || defaultLongitude;

    const apiUrl = eventId ? 'for-event' : categoryIds ? 'for-categories' : 'for-coordinate';
    //30.26172 -97.722017 500
    //30.27141 -97.758546 NaN
    const {
      data: trees,
      isFetching,
      refetch,
      isFetched,
    } = useGet<PartialTree[]>(`/api/trees/` + apiUrl, 'trees', {
      latitude,
      longitude,
      email,
      categoryIds,
      eventId,
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

    useEffect(() => {
      setMarkers(
        trees?.map(tree => {
          let isQuizCorrect;
          if (tree.speciesQuizResponses?.length > 0) {
            const quizResponse = tree.speciesQuizResponses[0];
            isQuizCorrect = quizResponse.isCorrect === true;
          }
          return { latitude: Number(tree.latitude), longitude: Number(tree.longitude), isQuizCorrect };
        }),
      );
    }, [trees]);

    useEffect(() => {
      if (isFetched && onFetched) onFetched(trees);
    }, [trees, isFetched]);

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
      if (showLocation) currentMapCoordinateRef.current = { latitude: viewport.latitude, longitude: viewport.longitude };
    };

    //const { remove } = useRemoveFromQuery(['attendees', { searchString }], handleDelete, true);
    const onNextTree = useCallback(
      (isPrev?: boolean) => {
        setSelectedTree(currentTree => {
          let newTree;
          if (!currentTree) newTree = trees[0];
          else {
            const currentIndex = trees.indexOf(currentTree);
            if (isPrev) {
              let prevIndex = currentIndex - 1;
              if (prevIndex < 0) prevIndex = trees.length - 1;
              newTree = trees[prevIndex];
            } else {
              let nextIndex = currentIndex + 1;
              if (nextIndex >= trees.length) nextIndex = 0;
              newTree = trees[nextIndex];
            }
          }
          return newTree;
        });
      },
      [trees],
    );

    const { updateById: updateTreeById } = useUpdateQueryById(
      [
        'trees',
        {
          latitude,
          longitude,
          email,
          categoryIds,
        },
      ],
      handleUpdate,
      true,
    );
    return (
      <QuizContext.Provider value={{ updateTreeById, trees, event }}>
        <Box>
          <TreeDisplayDialog
            tree={selectedTree}
            open={isQuizDialogOpen}
            setOpen={setIsQuizDialogOpen}
            eventId={eventId}
            onClose={() => {
              refetch();

              setIsFirstQuiz(false);
              if (onCloseDialog) onCloseDialog();
            }}
            onNextTree={onNextTree}
          ></TreeDisplayDialog>
          {isFetched && (
            <MapMarkerDisplay
              isGoogle={true}
              markers={markers}
              height={mapHeight}
              onClick={coordinate => {
                handleTreeClick(coordinate);
                setIsFirstQuiz(false);
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
        {isFetched && trees?.length > 0 && isFirstQuiz && (
          <Box sx={{ mt: event?.hasSpecificTrees ? '-50px' : -4, fontSize: '95%', zIndex: 1000, position: 'relative' }}>
            <Box
              style={{
                textDecoration: 'none',
                display: 'flex',
                gap: '3px',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#486e62',
                padding: '3px 5px',
                backgroundColor: '#FFCC37',
                borderRadius: '16px',
                width: event?.hasSpecificTrees ? '125px' : '175px',
                textAlign: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                cursor: event?.hasSpecificTrees ? 'pointer' : '',
                fontSize: event?.hasSpecificTrees ? '25px' : 'inherit',
                border: 'solid 1px',
              }}
              className='box-shadow'
              onClick={() => {
                if (event?.hasSpecificTrees) {
                  console.log('trees', trees);
                  setSelectedTree(trees[0]);
                  setIsQuizDialogOpen(true);
                  setIsFirstQuiz(false);
                }
              }}
            >
              {event?.hasSpecificTrees ? (
                'Play'
              ) : (
                <>
                  <PinIcon sx={{ fontSize: 'inherit' }}></PinIcon> Tap a pin to begin
                </>
              )}
            </Box>
          </Box>
        )}
      </QuizContext.Provider>
    );
  },
);
TreeIdQuiz.displayName = 'TreeIdQuiz';
export default TreeIdQuiz;
