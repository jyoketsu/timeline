import React from 'react';
import IconProps from '../interface/IconProps';

const SVG = ({
  style = {},
  fill = '#F5F5F5',
  width = 200,
  height = 200,
  className = '',
  viewBox = '0 0 1024 1024',
}: IconProps) => (
  <svg
    className={`svg-icon ${className || ''}`}
    style={style}
    viewBox={viewBox}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
  >
    <defs></defs>
    <path
      d="M18.432 459.264l455.168-348.672c31.232-23.552 75.776-1.536 75.776 37.376v174.08h422.4c28.672 0 51.712 23.04 51.712 51.712v246.272c0 28.672-23.04 51.712-51.712 51.712h-422.4v174.08c0 38.912-45.056 61.44-75.776 37.376L18.432 534.016c-24.576-18.944-24.576-55.808 0-74.752z"
      fill={fill}
    ></path>
  </svg>
);

export default SVG;
