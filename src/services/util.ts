import { DateTime } from 'luxon';
function datePlus(
  date: DateTime,
  dateUnit: 'year' | 'month' | 'day' | 'hour',
  amount: number
) {
  switch (dateUnit) {
    case 'year':
      return date.plus({ years: amount });
    case 'month':
      return date.plus({ months: amount });
    case 'day':
      return date.plus({ days: amount });
    case 'hour':
      return date.plus({ hours: amount });
    default:
      return date;
  }
}

function getDispTime(
  date: DateTime,
  dateUnit: 'year' | 'month' | 'day' | 'hour'
) {
  switch (dateUnit) {
    case 'year':
      return date.toFormat('yyyy');
    case 'month':
      return date.toFormat('yyyy LL');
    case 'day':
      return date.toFormat('yyyy-LL-dd');
    case 'hour':
      return date.toFormat('LL-dd T');
    default:
      return '';
  }
}

export { datePlus, getDispTime };
