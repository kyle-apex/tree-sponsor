import { useGet } from 'utils/hooks/use-get';
import { useUpdateQueryById } from 'utils/hooks/use-update-query-by-id';
import { Coordinate, PartialTree } from 'interfaces';
import { useCallback, useEffect, useState } from 'react';
import MapMarkerDisplay from 'components/maps/MapMarkerDisplay';
import Box from '@mui/material/Box';
import useLocalStorage from 'utils/hooks/use-local-storage';
import QuizContext from 'components/tree/QuizContext';
import TreeDisplay from 'components/tree/TreeDisplay';
import SplitRow from 'components/layout/SplitRow';
import Button from '@mui/material/Button';
/*
TODO:
Highlight selected map marker
Sequence numbers on map markers
*/
const TreeSequenceDisplay = ({
  treeGroupId,
  isRefreshing,
  setIsRefreshing,
  defaultLatitude,
  defaultLongitude,
}: {
  treeGroupId?: number;
  isRefreshing?: boolean;
  setIsRefreshing?: (val: boolean) => void;
  defaultLatitude?: number;
  defaultLongitude?: number;
}) => {
  const [email] = useLocalStorage('checkinEmail', '', 'checkinEmail2');
  const {
    data: trees,
    isFetching,
    refetch,
    isFetched,
  } = useGet<PartialTree[]>(`/api/groups/${treeGroupId}/trees`, 'trees', { treeGroupId });
  const [selectedTree, setSelectedTree] = useState<PartialTree>();

  const handleTreeClick = useCallback(
    (marker: Coordinate) => {
      const tree = trees.find(tree => Number(tree.latitude) == marker.latitude && Number(tree.longitude) == marker.longitude);
      setSelectedTree(tree);
    },
    [trees],
  );

  const nextTree = () => {
    setSelectedTree((tree: PartialTree) => {
      const index = trees?.indexOf(tree);
      console.log('index', index);
      if (!tree || (!index && index !== 0)) return tree;
      if (index + 1 >= trees?.length) return trees[0];
      return trees[index + 1];
    });
  };

  const previousTree = () => {
    setSelectedTree((tree: PartialTree) => {
      const index = trees?.indexOf(tree);

      if (!tree || (!index && index !== 0)) return tree;
      if (index - 1 < 0) return trees[trees.length - 1];
      return trees[index - 1];
    });
  };

  const refresh = useCallback(async () => {
    await refetch();
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    if (isRefreshing) refresh();
  }, [isRefreshing]);

  useEffect(() => {
    if (trees?.length > 0 && !selectedTree) setSelectedTree(trees[0]);
  }, [trees, selectedTree]);

  return (
    <QuizContext.Provider value={{ trees }}>
      <Box mb={1}>
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
            height='300px'
            onClick={coordinate => {
              handleTreeClick(coordinate);
            }}
            mapStyle='SATELLITE'
            markerScale={0.5}
            isQuiz={true}
            defaultLatitude={defaultLatitude}
            defaultLongitude={defaultLongitude}
            defaultZoom={17}
          ></MapMarkerDisplay>
        )}
      </Box>
      {selectedTree && (
        <>
          <SplitRow>
            <Button fullWidth color='inherit' sx={{ mt: 0 }} onClick={previousTree}>
              Previous
            </Button>
            <Button fullWidth color='inherit' sx={{ mt: 0 }} onClick={nextTree}>
              Next
            </Button>
          </SplitRow>
          <TreeDisplay title='Tree ID Quiz' tree={selectedTree} hasFullHeightImage={true} />
          <SplitRow>
            <Button fullWidth color='inherit' sx={{ mt: 2 }} onClick={previousTree}>
              Previous
            </Button>
            <Button fullWidth color='inherit' sx={{ mt: 2 }} onClick={nextTree}>
              Next
            </Button>
          </SplitRow>
        </>
      )}
    </QuizContext.Provider>
  );
};
export default TreeSequenceDisplay;
