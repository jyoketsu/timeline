import ReactStyle from './ReactStyle';

export default interface IconProps {
  name: 'left' | 'right' | 'zoomIn' | 'zoomOut' | 'home' | 'plus';
  style?: ReactStyle;
  fill?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  viewBox?: string;
}
