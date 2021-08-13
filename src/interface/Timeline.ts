import { HTMLAttributes } from 'react';
import NodeItem from './NodeItem';
import TimeLevel from './TimeLevel';

interface ClickAddFunc {
  (time: number, clientX: number, clientY: number): void;
}

export default interface TimelineProps extends HTMLAttributes<HTMLDivElement> {
  // 时间等级：
  timeLevels?: TimeLevel[];
  // 轴默认时间等级
  initTimeLevel?: TimeLevel;
  // 时间轴默认开始时间
  initTime?: number;
  backgroundColor?: string;
  shiftX?: number;
  // 节点列表
  nodeList: NodeItem[];
  nodeHeight: number;
  handleDateChanged?: DateChangedFunc;
  handleClickAdd?: ClickAddFunc;
  wheelable?: boolean;
  // 切换timeLevel时清空数据并在新的数据获得前不要重新渲染
  changeLevelRequestData?: boolean;
  ref?: any;
}

interface DateChangedFunc {
  (
    startDate: number,
    endDate: number,
    amount: number,
    currentTimeLevel: TimeLevel
  ): void;
}
