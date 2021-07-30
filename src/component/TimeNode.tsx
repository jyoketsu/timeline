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
      <use href="#time-item" x={x} y={23} />
      <text
        x={x + (itemWidth || 100) / 2}
        y={46}
        fontSize={isKeyDate ? 14 : 10}
        fontWeight="800"
        fill="#F5F5F5"
        style={{ userSelect: 'none' }}
        textAnchor="middle"
      >
        {displayTime}
      </text>
    </g>
  );
}
