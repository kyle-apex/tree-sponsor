/**
 * Helper function to format time range with single AM/PM when both times are in the same period
 * @param startDate - The start date/time
 * @param endDate - The end date/time (optional)
 * @returns Formatted time range string
 */
const formatTimeRange = (startDate: string | Date, endDate?: string | Date): string => {
  if (!startDate) return 'Time TBD';

  const start = new Date(startDate);
  const startHours = start.getHours();
  const startPeriod = startHours >= 12 ? 'pm' : 'am';

  if (!endDate) {
    return start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  const end = new Date(endDate);
  const endHours = end.getHours();
  const endPeriod = endHours >= 12 ? 'pm' : 'am';

  // If both times are in the same period (AM or PM), only show the period once at the end
  if (startPeriod === endPeriod) {
    return `${start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(` ${startPeriod.toUpperCase()}`, '')}-${end
      .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      .replace(` ${endPeriod.toUpperCase()}`, '')}${startPeriod}`;
  }

  // If different periods, show both
  return `${start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}-${end.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
};

export default formatTimeRange;
