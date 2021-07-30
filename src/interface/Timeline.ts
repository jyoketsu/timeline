import { HTMLAttributes } from 'react';
import NodeItem from './NodeItem';
import TimeLevel from './TimeLevel';

export default interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  // 时间等级：
  timeLevels?: TimeLevel[];
  // 轴默认时间等级
  initTimeLevel?: TimeLevel;
  // 时间轴默认开始时间
  initTime?: number;
  // 节点列表
  nodeList: NodeItem[];
  nodeHeight: number;
  handleDateChanged?: DateChangedFunc;
  handleSelectedDateChanged?: SelectedDateChangedFunc;
}

interface DateChangedFunc {
  (
    startDate: number,
    endDate: number,
    amount: number,
    currentTimeLevel: TimeLevel
  ): void;
}

interface SelectedDateChangedFunc {
  (selectedDate: number): void;
}