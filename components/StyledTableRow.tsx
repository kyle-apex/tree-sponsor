import withStyles from '@mui/styles/withStyles';
import TableRow from '@mui/material/TableRow';

export const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: 'var(--table-odd)',
    },
    '&:nth-of-type(even)': {
      backgroundColor: 'var(--table-even)',
    },
  },
}))(TableRow);
