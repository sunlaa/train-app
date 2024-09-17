const dateFromISOString = (isoString: string): Date => {
  const date = new Date(isoString);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return new Date(year, month, day, hours, minutes, seconds);
};

export default dateFromISOString;
