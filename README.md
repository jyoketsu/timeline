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

[![fMg2wD.png](https://z3.ax1x.com/2021/08/07/fMg2wD.png)](https://imgtu.com/i/fMg2wD)

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

### Hold down the right button and drag

## Props

| 属性              | 说明                 | 类型                      | 是否必须 | 默认值                 |
| ----------------- | -------------------- | ------------------------- | -------- | ---------------------- |
| timeLevels        | 时间等级列表         | TimeLevel[]               | 否       | 见下                   |
| initTimeLevel     | 初始化时间等级       | TimeLevel                 | 否       | `timeLevels[0]`        |
| initTime          | 初始化时间           | number (Millis Timestamp) | 否       | `new Date().getTime()` |
| backgroundColor   | 背景色               | string                    | 否       | `#2C3C4E`              |
| shiftX            | 横向偏移             | number                    | 否       | `0`                    |
| nodeList          | 时间轴中的子节点列表 | NodeItem[]                | 是       | -                      |
| nodeHeight        | 子节点元素高度       | number                    | 是       | -                      |
| handleDateChanged | 数据变化事件         | DateChangedFunc           | 否       | -                      |
| handleClickAdd    | 点击添加按钮         | ClickAddFunc              | 否       | -                      |
| wheelable         | 是否可以滚动缩放     | boolean                   | 否       | `true`                 |
| ref               | ref                  |                           | 否       | -                      |

### TimeLevel

```js
interface TimeLevel {
  name: string;
  dateUnit: 'year' | 'month' | 'day' | 'hour';
  amount: number;
  // 能被keyDate个dateUnit整除，则为keyDate
  keyDate: number;
}
```

### NodeItem

```js
export default interface NodeItem {
  _key: string;
  time: number;
  itemRender: Function;
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

### ClickAddFunc

```js
interface ClickAddFunc {
  (time: number, clientX: number, clientY: number): void;
}
```

### defaultTimeLevels

```js
const defaultTimeLevels: TimeLevel[] = [
  { name: 'hour', dateUnit: 'hour', amount: 1, keyDate: 12 },
  { name: 'day', dateUnit: 'day', amount: 1, keyDate: 5 },
  { name: 'week', dateUnit: 'day', amount: 7, keyDate: 5 },
  { name: 'month', dateUnit: 'month', amount: 1, keyDate: 5 },
  { name: 'year', dateUnit: 'year', amount: 1, keyDate: 5 },
  {
    name: 'ten-year',
    dateUnit: 'year',
    amount: 10,
    keyDate: 5,
  },
];
```
