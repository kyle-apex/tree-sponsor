import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import { useRef } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { PartialTree } from 'interfaces';
import Image from 'next/image';
import { ListItemAvatar } from '@mui/material';

interface DragItem {
  index: number;
  id: string;
  type: string;
}
const DragDropTree = ({ id, index, moveCard, tree }: { id: any; text: string; index: number; moveCard: any; tree: PartialTree }) => {
  const handleRef = useRef<HTMLLIElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'tree',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!handleRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = handleRef.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'tree',
    item: () => {
      return { id, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(handleRef));

  return (
    <ListItem ref={preview} sx={{ opacity: opacity, pl: 0, pr: 0 }} data-handler-id={handlerId}>
      <ListItemIcon ref={handleRef} sx={{ minWidth: '35px' }}>
        <DragIndicatorIcon></DragIndicatorIcon>
      </ListItemIcon>
      {tree.pictureUrl && (
        <ListItemAvatar sx={{ minWidth: '50px' }}>
          <Image
            height='40px'
            width='40px'
            style={{ borderRadius: '5px', textAlign: 'center', boxShadow: 'inset 0 0 2px gray' }}
            alt='Tree Preview'
            src={tree.pictureUrl}
          />
        </ListItemAvatar>
      )}
      <ListItemText>{tree?.species?.commonName}</ListItemText>
    </ListItem>
  );
};
export default DragDropTree;
