# Timeline-React（React 时间轴）

```

████████╗██╗███╗   ███╗███████╗██╗     ██╗███╗   ██╗███████╗
╚══██╔══╝██║████╗ ████║██╔════╝██║     ██║████╗  ██║██╔════╝
   ██║   ██║██╔████╔██║█████╗  ██║     ██║██╔██╗ ██║█████╗
   ██║   ██║██║╚██╔╝██║██╔══╝  ██║     ██║██║╚██╗██║██╔══╝
   ██║   ██║██║ ╚═╝ ██║███████╗███████╗██║██║ ╚████║███████╗
   ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝


```

## Screenshot

[![WsSGNR.png](https://z3.ax1x.com/2021/07/23/WsSGNR.png)](https://imgtu.com/i/WsSGNR)

## [live demo](https://jyoketsu.github.io/timeline/)

## Installation

```bash
yarn add @jyoketsu/timeline-react
```

or

```
npm i @jyoketsu/timeline-react
```

## Usage

```jsx
import TimeLevel from '@jyoketsu/timeline-react/dist/interface/TimeLevel';

<div className={classes.timeViewer}>
  <Timeline handleDateChanged={handleDateChanged}>
    {/* children component */}
    <TimeNodes nodeGroups={nodeGroups} columnCount={columnCount} />
  </Timeline>
</div>;
```

## Props

| 属性                      | 说明             | 类型                      | 是否必须 | 默认值                 |
| ------------------------- | ---------------- | ------------------------- | -------- | ---------------------- |
| timeLevels                | 时间等级列表     | TimeLevel[]               | 否       | 见下                   |
| initTimeLevel             | 初始化时间等级   | TimeLevel                 | 否       | `timeLevels[0]`        |
| initTime                  | 初始化时间       | number (Millis Timestamp) | 否       | `new Date().getTime()` |
| handleDateChanged         | 数据变化事件     | DateChangedFunc           | 否       | -                      |
| handleSelectedDateChanged | 选中节点变化事件 | SelectedDateChangedFunc   | 否       | -                      |

### TimeLevel

```js
interface TimeLevel {
  name: string;
  dateUnit: 'year' | 'month' | 'day' | 'hour';
  amount: number;
}
```

### DateChangedFunc

```js
interface DateChangedFunc {
  (
    startDate: number,
    endDate: number,
    amount: number,
    currentTimeLevel: TimeLevel
  ): void;
}
```

### SelectedDateChangedFunc

```js
interface SelectedDateChangedFunc {
  (selectedDate: number): void;
}
```

### defaultTimeLevels

```js
const defaultTimeLevels: TimeLevel[] = [
  { name: 'hour', dateUnit: 'hour', amount: 1 },
  { name: 'day', dateUnit: 'day', amount: 1 },
  { name: 'week', dateUnit: 'day', amount: 7 },
  { name: 'month', dateUnit: 'month', amount: 1 },
  { name: 'year', dateUnit: 'year', amount: 1 },
  { name: 'ten-year', dateUnit: 'year', amount: 10 },
];
```
