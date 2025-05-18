import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import { StyledTableRow } from 'components/StyledTableRow';
import { PartialAttendee } from 'interfaces';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

import DeleteIcon from '@mui/icons-material/Delete';
import { useRef, useState } from 'react';
import TextField from '@mui/material/TextField';

const AttendeeTableRow = ({
  attendee,
  onDelete,
  onUpdate,
}: {
  attendee: PartialAttendee;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, updates: PartialAttendee) => void;
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const attendeeRef = useRef<PartialAttendee>({ name: attendee.name });
  return (
    <StyledTableRow tabIndex={-1} key={attendee.checkinId}>
      <TableCell scope='row'>{attendee.eventName}</TableCell>
      <TableCell scope='row'>
        {!isEditMode && attendee.name}
        {isEditMode && (
          <TextField
            name='Name'
            onChange={e => {
              attendeeRef.current = { name: e.target.value };
            }}
            defaultValue={attendee.name}
            size='small'
          ></TextField>
        )}
      </TableCell>
      <TableCell scope='row'>{attendee.email}</TableCell>
      <TableCell scope='row'>{attendee.isMember == 1 ? 'Yes' : 'No'}</TableCell>
      <TableCell scope='row'>
        {attendee.createdDate?.toLocaleDateString
          ? attendee.createdDate?.toLocaleDateString() + ' ' + attendee.createdDate?.toLocaleTimeString()
          : attendee.createdDate}
      </TableCell>
      <TableCell scope='row'>{attendee.discoveredFrom}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        {!isEditMode && (
          <IconButton
            onClick={() => {
              setIsEditMode(true);
            }}
            size='large'
          >
            <EditIcon></EditIcon>
          </IconButton>
        )}

        {isEditMode && (
          <IconButton
            onClick={() => {
              onUpdate(attendee.userId, { name: attendeeRef.current.name });
              setIsEditMode(false);
            }}
            size='large'
          >
            <SaveIcon></SaveIcon>
          </IconButton>
        )}

        <IconButton
          onClick={() => {
            onDelete(attendee.checkinId);
          }}
          size='large'
        >
          <DeleteIcon></DeleteIcon>
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};
export default AttendeeTableRow;
