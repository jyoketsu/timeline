import React from 'react';
import IconProps from '../interface/IconProps';

import Left from './Left';
import Right from './right';
import ZoomIn from './ZoomIn';
import ZoomOut from './ZoomOut';
import Home from './Home';

const Icon = (props: IconProps) => {
  switch (props.name) {
    case 'left':
      return <Left {...props} />;
    case 'right':
      return <Right {...props} />;
    case 'zoomIn':
      return <ZoomIn {...props} />;
    case 'zoomOut':
      return <ZoomOut {...props} />;
    case 'home':
      return <Home {...props} />;
    default:
      return null;
  }
};

export default Icon;
