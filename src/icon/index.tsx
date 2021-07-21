import React from 'react';
import IconProps from '../interface/IconProps';

import VerticalLine from './VerticalLine';

const Icon = (props: IconProps) => {
  switch (props.name) {
    case 'verticalLine':
      return <VerticalLine {...props} />;
    default:
      return null;
  }
};

export default Icon;
