import { format, isThisYear, formatDistanceStrict } from 'date-fns';

export const formatPostDate = (date) => {
  const formatShort = format(new Date(date), 'MMMM d');
  const formatLong = format(new Date(date), 'MMMM d, yyy').toUpperCase();

  return isThisYear(new Date(date)) ? formatShort : formatLong;
};

export const formatDateToNowShort = (date) => {
  return formatDistanceStrict(new Date(date), Date.now())
    .split(' ')
    .map((s, i) => (i === 1 ? s[0] : s))
    .join('');
};
