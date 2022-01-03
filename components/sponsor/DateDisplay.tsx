import React from 'react';

const DateDisplay = ({ startDate }: { startDate: Date }) => {
  if (!startDate) return <></>;

  return (
    <span>
      {startDate.toLocaleString('default', { month: 'long', day: 'numeric' })}
      {startDate.getFullYear() != new Date().getFullYear() && <span>, {startDate.getFullYear()}</span>}
    </span>
  );
};
export default DateDisplay;
