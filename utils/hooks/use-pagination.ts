import { useState } from 'react';

export default function usePagination(initialRowsPerPage: number): {
  page: number;
  rowsPerPage: number;
  handleChangePage: (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => void;
  handleChangeRowsPerPage: (event: { target: { value: string } }) => void;
} {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return { page, rowsPerPage, handleChangePage, handleChangeRowsPerPage };
}
