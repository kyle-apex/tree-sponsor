import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { withStyles } from '@material-ui/core';
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

type HeaderCellOptions = {
  id: string;
  numeric?: boolean;
  disablePadding?: boolean;
  label: string;
};

export function TableHeader({
  classes,
  order,
  orderBy,
  rowCount,
  onRequestSort,
  headCells,
}: {
  classes?: Record<string, string>;
  onRequestSort?: (event: any, property: string) => void;
  order?: 'asc' | 'desc';
  orderBy?: string;
  rowCount?: number;
  headCells: HeaderCellOptions[];
}) {
  //const { classes, order, orderBy, rowCount, onRequestSort, headCells } = props;
  const createSortHandler = (property: string) => (event: any) => {
    onRequestSort(event, property);
  };
  useEffect(() => {
    console.log('head cells updated', JSON.stringify(headCells));
    return;
  }, [headCells]);
  //const classes = useStyles();

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {onRequestSort && (
              <TableSortLabel
                classes={{ active: classes.white, icon: classes.white }}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
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