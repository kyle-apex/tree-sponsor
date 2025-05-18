export default function getOneYearAgo(): Date {
  const currentDate = new Date();

  // Create a new date object for one year ago
  const oneYearAgo = new Date(currentDate);
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  return oneYearAgo;
}
