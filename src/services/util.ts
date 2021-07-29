import { DateTime } from 'luxon';
import TimeLevel from '../interface/TimeLevel';
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

// 时间取整
function getFixDate(date: DateTime, timeLevel: TimeLevel) {
  switch (timeLevel.dateUnit) {
    case 'year':
      return DateTime.local(date.year - (date.year % timeLevel.amount), 1, 1);
    case 'month':
      return DateTime.local(date.year, date.month, 1);
    case 'day':
      return DateTime.local(date.year, date.month, date.day);
    case 'hour':
      return DateTime.local(date.year, date.month, date.day, date.hour, 0);
    default:
      return date;
  }
}

function getUnit(date: DateTime, dateUnit: 'year' | 'month' | 'day' | 'hour') {
  switch (dateUnit) {
    case 'year':
      return date.year;
    case 'month':
      return date.month;
    case 'day':
      return date.day;
    case 'hour':
      return date.hour;
    default:
      return null;
  }
}

function getDispTime(
  date: DateTime,
  dateUnit: 'year' | 'month' | 'day' | 'hour',
  keyDate: number
) {
  const unit = getUnit(date, dateUnit);
  if (unit === null) {
    return null;
  }
  const isKeyDate = unit % keyDate === 0 ? true : false;
  switch (dateUnit) {
    case 'year':
      return {
        dispTime: date.toFormat('yyyy'),
        isKeyDate,
      };
    case 'month':
      return {
        dispTime: isKeyDate ? date.toFormat('yyyy LL') : date.toFormat('LL'),
        isKeyDate,
      };
    case 'day':
      return {
        dispTime: isKeyDate ? date.toFormat('yyyy-LL-dd') : date.toFormat('dd'),
        isKeyDate,
      };
    case 'hour':
      return {
        dispTime: isKeyDate
          ? date.toFormat('yyyy-LL-dd T')
          : date.toFormat('T'),
        isKeyDate,
      };
    default:
      return null;
  }
}

export { datePlus, getDispTime, getFixDate };
