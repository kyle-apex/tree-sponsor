export default function getOneYearAgo(): Date {
  const calendarYear = new Date();
  calendarYear.setFullYear(calendarYear.getFullYear() - 1);
  return calendarYear;
}
