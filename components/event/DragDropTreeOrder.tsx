import { useCallback, useState } from 'react';
import update from 'immutability-helper';

import List from '@mui/material/List';
import DragDropTree from './DragDropTree';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PartialTree } from 'interfaces';

const DragDropTreeOrder = ({ defaultTrees }: { defaultTrees: PartialTree[] }) => {
  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setTrees((prevTrees: PartialTree[]) => {
      const newTrees = [...prevTrees];
      newTrees.splice(dragIndex, 1);
      newTrees.splice(hoverIndex, 0, prevTrees[dragIndex]);
      const prevDefault = [...defaultTrees];
      defaultTrees.splice(dragIndex, 1);
      defaultTrees.splice(hoverIndex, 0, prevDefault[dragIndex]);
      return newTrees;
    });
  }, []);
  const [trees, setTrees] = useState<PartialTree[]>(defaultTrees);
  const renderDragItem = useCallback((tree: PartialTree, index: number) => {
    return <DragDropTree key={tree.id} text={tree.id + 'hey'} moveCard={moveCard} id={tree.id} index={index} tree={tree}></DragDropTree>;
  }, []);
  return (
    <DndProvider backend={HTML5Backend}>
      <List>{trees.map((tree, i) => renderDragItem(tree, i))}</List>
    </DndProvider>
  );
};
export default DragDropTreeOrder;
