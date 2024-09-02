export const datesAreSequential = (dates: Date[]) => {
  if (dates.length === 0) return true;
  let prevDate = dates[0];
  for (let i = 1; i < dates.length; i += 1) {
    if (prevDate >= dates[i]) {
      return false;
    }
    prevDate = dates[i];
  }
  return true;
};
