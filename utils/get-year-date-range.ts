export function getYearDateRange(year: number, alwaysIncludeEndDate?: boolean): { startDate: Date; endDate: Date } {
  const startDate = new Date();
  startDate.setFullYear(year);
  startDate.setMonth(0);
  startDate.setDate(1);
  startDate.setHours(0);
  startDate.setMinutes(0);

  let endDate = new Date();
  endDate.setFullYear(year + 1);
  endDate.setMonth(0);
  endDate.setDate(1);
  endDate.setHours(0);
  endDate.setMinutes(0);

  if (endDate.getFullYear() > new Date().getFullYear()) {
    if (alwaysIncludeEndDate) {
      // set end range to tomorrow
      endDate = new Date();
      endDate.setDate(new Date().getDate() + 1);
      endDate.setHours(0);
      endDate.setMinutes(0);
    } else endDate = undefined;
  }

  return { startDate, endDate };
}
