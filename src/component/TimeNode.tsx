import React from 'react';
import TimeNodeProps from '../interface/TimeNode';

export default function TimeNode({
  displayTime,
  x,
  isKeyDate,
  itemWidth,
}: TimeNodeProps) {
  return (
    <g>
      <use href={isKeyDate ? '#key-time-item' : '#time-item'} x={x} y={0} />
      <text
        x={x + (itemWidth || 100) / 2}
        y={isKeyDate ? 40 : 26}
        fontSize={isKeyDate ? 12 : 10}
        fontWeight={isKeyDate ? '800' : 'normal'}
        fill={isKeyDate ? '#808080' : '#9d9d9d'}
        style={{ userSelect: 'none' }}
        textAnchor="middle"
      >
        {displayTime}
      </text>
    </g>
  );
}
