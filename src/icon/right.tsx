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
    <path
      d="M1005.568 474.624l-455.168-348.672c-31.232-23.552-75.776-1.536-75.776 37.376v174.08H51.712C23.04 336.896 0 360.448 0 388.608V634.88c0 28.672 23.04 51.712 51.712 51.712h422.4v174.08c0 38.912 45.056 61.44 75.776 37.376l455.168-348.672c25.088-18.944 25.088-55.808 0.512-74.752z"
      p-id="2505"
      fill={fill}
    ></path>
  </svg>
);

export default SVG;
