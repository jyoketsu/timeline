import { HTMLAttributes, ReactChild } from 'react';
import TimeLevel from './TimeLevel';

export default interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  // 时间等级：
  timeLevels?: TimeLevel[];
  // 轴默认时间等级
  initTimeLevel?: TimeLevel;
  // 时间轴默认开始时间
  initTime?: number;
  children?: ReactChild;
}
