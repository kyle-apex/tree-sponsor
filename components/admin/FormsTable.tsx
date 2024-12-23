import React, { useEffect, useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import makeStyles from '@mui/styles/makeStyles';
import { TableHeader } from 'components/TableHeader';
import { StyledTableRow } from 'components/StyledTableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/router';
import LaunchIcon from '@mui/icons-material/Launch';

import { PartialForm } from 'interfaces';
import { Router } from '@mui/icons-material';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';

const useStyles = makeStyles(theme => ({
  table: {
    minWidth: 0,
  },
  tableContainer: {
    marginBottom: theme.spacing(3),
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  white: {
    color: theme.palette.common.white + '!important',
  },
}));

const headerCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'startDate', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'location', numeric: false, disablePadding: false, label: 'Location' },
  { id: 'path', numeric: false, disablePadding: false, label: 'Path' },
  { id: 'edit', numeric: false, disablePadding: false },
];

export default function FormsTable({
  forms,
  isFetching,
  onDelete,
  isPastForm,
}: {
  forms: PartialForm[];
  isFetching: boolean;
  onDelete?: (formId: number) => void;
  isPastForm?: boolean;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const classes = useStyles();

  const router = useRouter();

  const edit = (path: string) => {
    if (!path) return;
    router.push(`/admin/forms/${path}`);
  };
  const preview = (path: string) => {
    if (!path) return;
    window.open(`/f/${path}/`);
  };

  return (
    <>
      <TableContainer className={classes.tableContainer}>
        <Table className={classes.table} aria-labelledby='tableTitle' size='medium' aria-label='enhanced table'>
          <TableHeader classes={classes} headCells={headerCells} />
          {forms && (
            <TableBody>
              {isFetching && (
                <TableRow>
                  <TableCell colSpan={6} className='compressed'>
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              )}
              {forms.map((form: PartialForm) => {
                return (
                  <StyledTableRow tabIndex={-1} key={form.id}>
                    <TableCell scope='row'>{form.name}</TableCell>
                    <TableCell scope='row'>{form.startDate?.toLocaleDateString() + ' ' + form.startDate?.toLocaleTimeString()}</TableCell>
                    <TableCell scope='row'>{form.location?.name}</TableCell>
                    <TableCell scope='row'>{form.path}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          edit(form.path);
                        }}
                        size='large'
                      >
                        <EditIcon></EditIcon>
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          preview(form.path);
                        }}
                        size='large'
                      >
                        <LaunchIcon></LaunchIcon>
                      </IconButton>
                      {!isPastForm && (
                        <>
                          <IconButton
                            onClick={() => {
                              setCurrentId(form.id);
                              setIsConfirmOpen(true);
                            }}
                            size='large'
                          >
                            <DeleteIcon></DeleteIcon>
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </TableContainer>
      <DeleteConfirmationDialog
        open={isConfirmOpen}
        setOpen={setIsConfirmOpen}
        itemType='form'
        title='Remove Form'
        onConfirm={() => onDelete(currentId)}
      ></DeleteConfirmationDialog>
    </>
  );
}
