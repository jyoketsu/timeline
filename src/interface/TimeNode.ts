import { DateTime } from 'luxon';

export default interface TimeNodeProps {
  time?: DateTime;
  displayTime?: string;
  isKeyDate: boolean;
  x: number;
  fill?: string;
  itemWidth?: number;
}
