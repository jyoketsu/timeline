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
      d="M720 464H304a48 48 0 1 0 0 96h416a48 48 0 1 0 0-96zM512 0C229.232 0 0 229.232 0 512c0 282.768 229.232 512 512 512h464a48 48 0 0 0 48-48V512.032 512C1024 229.232 794.768 0 512 0z m416 512.016C928 741.744 741.776 927.968 512.064 928H512C282.256 928 96 741.76 96 512 96 282.256 282.256 96 512 96c229.76 0 416 186.256 416 416.016z"
      fill={fill}
    ></path>
  </svg>
);

export default SVG;
