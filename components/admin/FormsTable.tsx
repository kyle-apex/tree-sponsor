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
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { useRouter } from 'next/router';
import LaunchIcon from '@mui/icons-material/Launch';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';

import { PartialForm } from 'interfaces';
import { Router } from '@mui/icons-material';
import DeleteConfirmationDialog from 'components/DeleteConfirmationDialog';
import Link from 'next/link';

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
  deletedRow: {
    opacity: 0.6,
    backgroundColor: theme.palette.action.hover,
  },
  toggleContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
}));

const headerCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'path', numeric: false, disablePadding: false, label: 'Path' },
  { id: 'responses', numeric: true, disablePadding: false, label: 'Responses' },
  { id: 'edit', numeric: false, disablePadding: false },
];

export default function FormsTable({
  forms,
  isFetching,
  onDelete,
  onRestore,
  onToggleShowDeleted,
  showDeleted = false,
}: {
  forms: PartialForm[];
  isFetching: boolean;
  onDelete?: (formId: number) => void;
  onRestore?: (formId: number) => void;
  onToggleShowDeleted?: (showDeleted: boolean) => void;
  showDeleted?: boolean;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [includeDeleted, setIncludeDeleted] = useState(showDeleted);
  const classes = useStyles();

  const router = useRouter();

  const edit = (id: number) => {
    if (!id) return;
    router.push(`/admin/forms/${id}`);
  };
  const preview = (path: string) => {
    if (!path) return;
    window.open(`/f/${path}/`);
  };

  const handleToggleDeleted = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('toggle');
    const newValue = event.target.checked;
    setIncludeDeleted(newValue);
    if (onToggleShowDeleted) {
      onToggleShowDeleted(newValue);
    }
  };

  return (
    <>
      <Box className={classes.toggleContainer}>
        <FormControlLabel
          control={<Switch checked={includeDeleted} onChange={handleToggleDeleted} color='primary' />}
          label='Show deleted forms'
        />
      </Box>
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
                const isDeleted = !!form.deletedAt;
                return (
                  <StyledTableRow tabIndex={-1} key={form.id} className={isDeleted ? classes.deletedRow : ''}>
                    <TableCell scope='row'>
                      {form.name}
                      {isDeleted && <span> (Deleted)</span>}
                    </TableCell>
                    <TableCell scope='row'>{form.path}</TableCell>
                    <TableCell scope='row' align='right'>
                      {form.formResponses?.length ? (
                        <Link href={'/admin/forms/' + form.id + '/responses'}>
                          <a>
                            View {form.formResponses?.length} Response{form.formResponses?.length > 1 ? 's' : ''}
                          </a>
                        </Link>
                      ) : (
                        ''
                      )}
                    </TableCell>
                    <TableCell align='right'>
                      <IconButton
                        onClick={() => {
                          edit(form.id);
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

                      {isDeleted ? (
                        <IconButton
                          onClick={() => {
                            setCurrentId(form.id);
                            setIsRestoreConfirmOpen(true);
                          }}
                          size='large'
                          title='Restore form'
                        >
                          <RestoreFromTrashIcon></RestoreFromTrashIcon>
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={() => {
                            setCurrentId(form.id);
                            setIsConfirmOpen(true);
                          }}
                          size='large'
                          title='Delete form'
                        >
                          <DeleteIcon></DeleteIcon>
                        </IconButton>
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
      <DeleteConfirmationDialog
        open={isRestoreConfirmOpen}
        setOpen={setIsRestoreConfirmOpen}
        itemType='form'
        title='Restore Form'
        confirmText='Restore'
        bodyText='Are you sure you want to restore this form?'
        onConfirm={() => onRestore(currentId)}
      />
    </>
  );
}
