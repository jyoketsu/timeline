import { DateTime } from 'luxon';

export default interface TimeNodeProps {
  time?: DateTime;
  displayTime: string;
  x: number;
}
