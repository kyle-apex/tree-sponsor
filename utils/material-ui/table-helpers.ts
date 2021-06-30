export function descendingComparator(a: any, b: any, orderBy: string) {
  const aValue = typeof b[orderBy] === 'string' ? b[orderBy].toLowerCase() : b[orderBy];
  const bValue = typeof a[orderBy] === 'string' ? a[orderBy].toLowerCase() : a[orderBy];

  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

export function getComparator(order: string, orderBy: string) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array: any[], comparator: any) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}
