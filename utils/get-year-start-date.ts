export default function getYearStartDate(year: number): Date {
  const yearStart = new Date();
  yearStart.setFullYear(year);
  yearStart.setMonth(0);
  yearStart.setDate(0);
  return yearStart;
}
