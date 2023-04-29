import { useGet } from 'utils/hooks/use-get';
import { useUpdateQueryById } from 'utils/hooks/use-update-query-by-id';
import { Coordinate, PartialTree } from 'interfaces';
import { useCallback, useEffect, useState } from 'react';
import MapMarkerDisplay from 'components/maps/MapMarkerDisplay';
import Box from '@mui/material/Box';
import TreeDisplayDialog from 'components/tree/TreeDisplayDialog';
import useLocalStorage from 'utils/hooks/use-local-storage';
import QuizContext from 'components/tree/QuizContext';

const handleUpdate = async (id: number, attributes: any) => {
  console.log('id', id, attributes);
};

const TreeIdQuiz = ({
  eventId,
  isRefreshing,
  setIsRefreshing,
}: {
  eventId?: number;
  isRefreshing?: boolean;
  setIsRefreshing?: (val: boolean) => void;
}) => {
  const [email] = useLocalStorage('checkinEmail', '');
  const {
    data: trees,
    isFetching,
    refetch,
    isFetched,
  } = useGet<PartialTree[]>(`/api/events/${eventId}/trees`, 'trees', { email, eventId });
  const [selectedTree, setSelectedTree] = useState<PartialTree>();
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);

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

  //const { remove } = useRemoveFromQuery(['attendees', { searchString }], handleDelete, true);

  const { updateById: updateTreeById } = useUpdateQueryById(['trees', { email, eventId }], handleUpdate, true);
  return (
    <QuizContext.Provider value={{ updateTreeById, trees }}>
      <Box mb={3}>
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
            height='200px'
            onClick={coordinate => {
              handleTreeClick(coordinate);
            }}
            mapStyle='SATELLITE'
            markerScale={0.5}
            isQuiz={true}
          ></MapMarkerDisplay>
        )}
      </Box>
    </QuizContext.Provider>
  );
};
export default TreeIdQuiz;
