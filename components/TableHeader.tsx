import { SxProps, Theme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import withStyles from '@mui/styles/withStyles';
import { useEffect } from 'react';

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

export type HeaderCellOptions = {
  id: string;
  numeric?: boolean;
  disablePadding?: boolean;
  label?: string;
  sx?: SxProps<Theme>;
};

export function TableHeader({
  classes,
  order,
  orderBy,
  onRequestSort,
  headCells,
}: {
  classes?: Record<string, string>;
  onRequestSort?: (property: string) => void;
  order?: 'asc' | 'desc';
  orderBy?: string;
  rowCount?: number;
  headCells: HeaderCellOptions[];
}): JSX.Element {
  const createSortHandler = (property: string) => {
    onRequestSort(property);
  };
  useEffect(() => {
    return;
  }, [headCells]);

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={headCell.sx}
          >
            {onRequestSort && (
              <TableSortLabel
                classes={{ active: classes.white, icon: classes.white }}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
                ) : null}
              </TableSortLabel>
            )}
            {!onRequestSort && headCell.label}
          </StyledTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
