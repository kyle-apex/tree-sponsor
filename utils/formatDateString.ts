const formatDateString = (date: Date): string => {
  if (!date) return '';

  let dateStr = date.toLocaleString('default', { month: 'long', day: 'numeric' });
  if (date.getFullYear() != new Date().getFullYear()) dateStr += ', ' + date.getFullYear();
  return dateStr;
};
export default formatDateString;
