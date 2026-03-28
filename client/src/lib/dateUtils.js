import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatDate = (date, tz) => {
  return dayjs(date).tz(tz).format('dddd, MMMM D, YYYY');
};

export const formatTime = (date, tz) => {
  return dayjs(date).tz(tz).format('h:mm A');
};

export const formatDateTime = (date, tz) => {
  return dayjs(date).tz(tz).format('MMM D, YYYY h:mm A');
};

export const getUserTimezone = () => {
  return dayjs.tz.guess();
};

export { dayjs };
