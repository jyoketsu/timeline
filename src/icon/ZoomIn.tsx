import React from 'react';
import IconProps from '../interface/IconProps';

const SVG = ({
  style = {},
  fill = '#C0C0C0',
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
      d="M696.32 635.989333l229.845333 229.845334-60.330666 60.330666-229.845334-229.845333a341.333333 341.333333 0 1 1 60.330667-60.330667zM426.666667 682.666667a256 256 0 1 0 0-512 256 256 0 0 0 0 512zM384 384V256h85.333333v128h128v85.333333h-128v128H384v-128H256V384h128z"
      fill={fill}
    ></path>
  </svg>
);

export default SVG;
