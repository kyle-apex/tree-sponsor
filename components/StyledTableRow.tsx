import { withStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';

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
