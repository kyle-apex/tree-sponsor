import React from 'react';
import formatDateString from 'utils/formatDateString';

const DateDisplay = ({ startDate }: { startDate: Date }) => {
  if (!startDate) return <></>;

  return <span>{formatDateString(startDate)}</span>;
};
export default DateDisplay;
