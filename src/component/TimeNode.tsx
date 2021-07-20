import React from 'react';
import TimeLevel from '../interface/TimeLevel';
import { DateTime } from 'luxon';
import { datePlus, getDispTime } from '../services/util';

interface Props {
  index: number;
  initTime: DateTime;
  timeLevel: TimeLevel;
}
export default function TimeNode({ index, initTime, timeLevel }: Props) {
  const dispTime = getDispTime(
    datePlus(initTime, timeLevel.dateUnit, index * timeLevel.amount),
    timeLevel.dateUnit
  );

  return (
    <g>
      <use href="#time-item" x={index * 100} y={23} />
      <text
        x={index * 100 + 50}
        y={46}
        fontSize="10"
        fontWeight="800"
        fill="#F5F5F5"
        style={{ userSelect: 'none' }}
        textAnchor="middle"
      >
        {dispTime}
      </text>
    </g>
  );
}
