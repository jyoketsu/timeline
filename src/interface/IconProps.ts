import ReactStyle from './ReactStyle';

export default interface IconProps {
  name?: 'verticalLine';
  style?: ReactStyle;
  fill?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
  viewBox?: string;
}
