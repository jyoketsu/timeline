import { DateTime } from 'luxon';
function datePlus(
  date: DateTime,
  dateUnit: 'year' | 'month' | 'day',
  amount: number
) {
  switch (dateUnit) {
    case 'year':
      return date.plus({ years: amount });
    case 'month':
      return date.plus({ months: amount });
    case 'day':
      return date.plus({ days: amount });
    default:
      return date;
  }
}

function getDispTime(date: DateTime, dateUnit: 'year' | 'month' | 'day') {
  switch (dateUnit) {
    case 'year':
      return date.toFormat('yyyy');
    case 'month':
      return date.toFormat('yyyy LL');
    case 'day':
      return date.toISODate();
    default:
      return '';
  }
}

export { datePlus, getDispTime };
