export default function setTime(date1: Date, date2: Date) {
  const hours = date2.getHours();
  const minutes = date2.getMinutes();

  date1.setHours(hours, minutes);
  return date1;
}
