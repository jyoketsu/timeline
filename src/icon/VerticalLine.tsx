import React from 'react';
import IconProps from '../interface/IconProps';

const SVG = ({
  style = {},
  fill = '#000',
  width = '100%',
  height = '100%',
  className = '',
  viewBox = '0 0 10 10',
}: // viewBox = "0 0 12 9"
IconProps) => (
  <svg
    width={width}
    style={style}
    height={height}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={`svg-icon ${className || ''}`}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path fill={fill} d="M 0 0 H 10 V 10 H 0 Z" />
    {/* <path
      fill={fill}
      d="M 5.99609 1.51367C 7.93604 1.51367 9.7041 2.22479 11.0596 3.39136L 12 2.35657C 10.3945 0.969788 8.29785 0 5.99561 0C 3.69775 0 1.60352 0.967163 0 2.35022L 0.938965 3.38574C 2.29395 2.22217 4.05908 1.51367 5.99609 1.51367ZM 5.91553 5.9726C 5.13672 5.9726 4.42383 6.28912 3.86963 6.74567L 5.91553 9L 7.96338 6.74792C 7.40918 6.29028 6.69531 5.9726 5.91553 5.9726ZM 9.01318 5.61206C 8.19385 4.92072 7.13184 4.5 5.96875 4.5C 4.80811 4.5 3.74756 4.91882 2.9292 5.60907L 1.93457 4.5127C 3.01758 3.58954 4.42578 2.98633 5.96924 2.98633C 7.51562 2.98633 8.92578 3.59143 10.0088 4.51721L 9.01318 5.61206Z"
    /> */}
  </svg>
);

export default SVG;
