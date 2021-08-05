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
      <use href={isKeyDate ? '#key-time-item' : '#time-item'} x={x} y={5} />
      <text
        x={x + (itemWidth || 100) / 2}
        y={isKeyDate ? 40 : 26}
        fontSize={isKeyDate ? 12 : 10}
        fontWeight="800"
        fill={isKeyDate ? '#808080' : '#C0C0C0'}
        style={{ userSelect: 'none' }}
        textAnchor="middle"
      >
        {displayTime}
      </text>
    </g>
  );
}
