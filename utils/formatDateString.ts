const formatDateString = (date: Date, hasShortMonth?: boolean): string => {
  if (!date) return '';
  if (typeof date == 'string') date = new Date(date);

  let dateStr = date.toLocaleString('default', { month: hasShortMonth ? 'short' : 'long', day: 'numeric' });
  if (date.getFullYear() != new Date().getFullYear()) dateStr += ', ' + date.getFullYear();
  return dateStr;
};
export default formatDateString;
