/**
 * Shared date utility for ISO week number.
 * Week 1 is the week containing the first Thursday of the year.
 */
function getIsoWeekNumber(date = new Date()) {
  const workingDate = new Date(date);
  const mondayIndex = (workingDate.getDay() + 6) % 7;
  workingDate.setDate(workingDate.getDate() - mondayIndex + 3);

  const currentThursday = workingDate.valueOf();
  workingDate.setMonth(0, 1);
  if (workingDate.getDay() !== 4) {
    workingDate.setMonth(0, 1 + (4 - workingDate.getDay() + 7) % 7);
  }

  const firstThursday = workingDate.valueOf();
  return 1 + Math.ceil((currentThursday - firstThursday) / 604800000);
}
