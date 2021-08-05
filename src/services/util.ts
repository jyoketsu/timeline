import { DateTime } from 'luxon';
import TimeLevel from '../interface/TimeLevel';
import TimeNodeProps from '../interface/TimeNode';
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

function getDispTime(date: DateTime, timeLevel: TimeLevel) {
  const unit = getUnit(date, timeLevel.dateUnit);
  if (unit === null) {
    return null;
  }
  let isKeyDate;
  if (timeLevel.keyDatePlace) {
    const res = ~~(
      (unit % (timeLevel.keyDatePlace * 10)) /
      timeLevel.keyDatePlace
    );
    console.log('---res---', unit, res);

    isKeyDate = res % timeLevel.keyDate === 0 ? true : false;
  } else {
    isKeyDate = unit % timeLevel.keyDate === 0 ? true : false;
  }

  switch (timeLevel.dateUnit) {
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

function getNodeX(targetTime: number, timeNodeArray: TimeNodeProps[]) {
  const startNode = timeNodeArray[0];
  const endNode = timeNodeArray[timeNodeArray.length - 1];
  if (startNode.time && endNode.time) {
    const endStartTimeDiff =
      endNode.time.toMillis() - startNode.time.toMillis();
    const initStartTimeDiff = targetTime - startNode.time.toMillis();
    if (initStartTimeDiff > 0 && initStartTimeDiff < endStartTimeDiff) {
      const x =
        startNode.x +
        (endNode.x - startNode.x) * (initStartTimeDiff / endStartTimeDiff);
      return x;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

function getTwoNodeDiffTime(timeLevel: TimeLevel) {
  switch (timeLevel.dateUnit) {
    case 'hour':
      return 3600000 * timeLevel.amount;
    case 'day':
      return 86400000 * timeLevel.amount;
    case 'month':
      return 2592000000 * timeLevel.amount;
    case 'year':
      return 31104000000 * timeLevel.amount;
    default:
      return 0;
  }
}

function getNodeColumn(
  targetTime: number,
  startTimeNode: TimeNodeProps,
  timeLevel: TimeLevel
) {
  // 两个相隔节点的时间差
  const twoNodeDiffTime = getTwoNodeDiffTime(timeLevel);
  if (startTimeNode.time) {
    const targetIndex = Math.floor(
      (targetTime - startTimeNode.time?.toMillis()) / twoNodeDiffTime
    );
    return targetIndex;
  } else {
    return 0;
  }
}

export { datePlus, getDispTime, getFixDate, getNodeX, getNodeColumn };
