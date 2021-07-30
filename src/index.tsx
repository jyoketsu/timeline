import React, { FC, useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import TimeNode from './component/TimeNode';
import ReactStyle from './interface/ReactStyle';
import TimelineProps from './interface/Timeline';
import {
  datePlus,
  getDispTime,
  getFixDate,
  getNodeColumn,
  getNodeX,
} from './services/util';
import TimeLevel from './interface/TimeLevel';
import TimeNodeProps from './interface/TimeNode';
import Icon from './icon';
import NodeGroupItem from './interface/NodeGroupItem';
import TimeNodes from './component/TimeNodes';

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */

const ITEM_WIDTH = 100;
const ANIME_TIME = 500;

let timeout: NodeJS.Timeout;

const classes: ReactStyle = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '1fr 56px',
  },
  contentWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '360px',
    backgroundColor: '#2C3C4E',
  },
  timelineWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#696969',
    // cursor: 'move',
  },
  verticalLine: {
    position: 'absolute',
    width: '3px',
    height: '100%',
    backgroundColor: '#C0C0C0',
    top: '0',
  },
  left: {
    position: 'absolute',
    left: '8px',
    bottom: '60px',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3C4E',
  },
  right: {
    position: 'absolute',
    right: '8px',
    bottom: '60px',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C3C4E',
  },
  zoomIn: {
    position: 'absolute',
    top: '25px',
    right: '8px',
    cursor: 'pointer',
  },
  zoomOut: {
    position: 'absolute',
    top: '63px',
    right: '8px',
    cursor: 'pointer',
  },
  home: {
    position: 'absolute',
    top: '101px',
    right: '8px',
    cursor: 'pointer',
  },
};

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

export const Timeline: FC<TimelineProps> = ({
  timeLevels = defaultTimeLevels,
  initTime = new Date().getTime(),
  nodeList,
  nodeHeight,
  handleDateChanged,
  handleSelectedDateChanged,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTimeLevel, setCurrentTimeLevel] = useState<TimeLevel>(
    defaultTimeLevels[0]
  );
  const [startTime, setStartTime] = useState(DateTime.fromMillis(initTime));
  const [perPage, setPerPage] = useState(0);
  const [timeNodeArray, setTimeNodeArray] = useState<TimeNodeProps[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [transition, setTransition] = useState(true);
  const [clickX, setClickX] = useState<number | null>(null);
  const [initTimeX, setInitTimeX] = useState<number | null>(null);
  const [nodeGroups, setNodeGroups] = useState<NodeGroupItem[][]>([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (containerRef && containerRef.current) {
      const count = Math.ceil(containerRef.current.offsetWidth / ITEM_WIDTH);
      setPerPage(count);
      setTranslateX(-count * ITEM_WIDTH);
    }
  }, [containerRef]);

  useEffect(() => {
    if (perPage) {
      let array: TimeNodeProps[] = [];
      // 使当前时间在时间轴中居中
      let headTime = datePlus(
        startTime,
        currentTimeLevel.dateUnit,
        -(Math.floor((perPage * 3) / 2) - 1) * currentTimeLevel.amount
      );
      // 根据dateUnit时间取整
      headTime = getFixDate(headTime, currentTimeLevel);

      // // 如果timeLevel不是小时，最左侧开始时间设为零点
      // if (currentTimeLevel.dateUnit !== 'hour') {
      //   headTime = DateTime.fromMillis(
      //     new Date(headTime.toLocaleString()).getTime()
      //   );
      // } else {
      //   // 取整点
      //   let headTimeMillis = headTime.toMillis();
      //   headTimeMillis = headTimeMillis - (headTimeMillis % 3600000);
      //   headTime = DateTime.fromMillis(headTimeMillis);
      // }
      for (let index = 0; index < perPage * 3; index++) {
        const time = datePlus(
          headTime,
          currentTimeLevel.dateUnit,
          index * currentTimeLevel.amount
        );
        const dispRes = getDispTime(
          time,
          currentTimeLevel.dateUnit,
          currentTimeLevel.keyDate
        );
        array.push({
          time,
          displayTime: dispRes?.dispTime || '',
          isKeyDate: dispRes?.isKeyDate || false,
          x: index * ITEM_WIDTH,
        });
      }
      setTimeNodeArray(array);
      if (handleDateChanged) {
        const startDate = array[0].time?.toMillis();
        const endDate = array[array.length - 1].time?.toMillis();
        if (startDate && endDate) {
          handleDateChanged(startDate, endDate, perPage, currentTimeLevel);
        }
      }
    }
  }, [perPage, startTime, currentTimeLevel]);

  useEffect(() => {
    if (handleSelectedDateChanged && clickX) {
      const ratio =
        (clickX + Math.abs(translateX)) / (perPage * 3 * ITEM_WIDTH);
      const startNode = timeNodeArray[0];
      const endNode = timeNodeArray[timeNodeArray.length - 1];
      if (startNode.time && endNode.time) {
        const timeDiff =
          datePlus(
            endNode.time,
            currentTimeLevel.dateUnit,
            currentTimeLevel.amount
          ).toMillis() - startNode.time.toMillis();
        const clickTime =
          datePlus(
            startNode.time,
            currentTimeLevel.dateUnit,
            -currentTimeLevel.amount / 2
          ).toMillis() +
          timeDiff * ratio;
        handleSelectedDateChanged(clickTime);
      }
    }
  }, [clickX, translateX, perPage, timeNodeArray]);

  useEffect(() => {
    if (timeNodeArray.length) {
      const initX = getNodeX(initTime, timeNodeArray);
      setInitTimeX(initX);
    }
  }, [timeNodeArray]);

  useEffect(() => {
    if (perPage && timeNodeArray.length) {
      const startDateNode = timeNodeArray[0];
      const columnCount = perPage * 3;
      let nodeGroups: NodeGroupItem[][] = new Array(columnCount);
      for (let index = 0; index < nodeGroups.length; index++) {
        nodeGroups[index] = [];
      }
      nodeList.sort((a, b) => a.time - b.time);
      for (let index = 0; index < nodeList.length; index++) {
        const node = nodeList[index];
        // 两个相隔节点的时间差
        const column = getNodeColumn(
          node.time,
          startDateNode,
          currentTimeLevel
        );
        const x = getNodeX(node.time, timeNodeArray);
        if (column !== -1 && nodeGroups[column]) {
          nodeGroups[column].push({
            x,
            node,
          });
        }
      }
      setNodeGroups(nodeGroups);
    }
  }, [nodeList, perPage, timeNodeArray]);

  // 点击左右移动按钮
  const handleClickMoveButton = (next: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      !transition ||
      translateX === 0 ||
      translateX === -perPage * 2 * ITEM_WIDTH
    ) {
      return;
    }
    // 移动一个元素的宽度
    setTranslateX((prevX) => (next ? prevX + ITEM_WIDTH : prevX - ITEM_WIDTH));

    // 如果移到头了
    if (
      // 往右边到头
      (next && translateX + ITEM_WIDTH === 0) ||
      // 往左边到头
      (!next && translateX - ITEM_WIDTH === -perPage * 2 * ITEM_WIDTH)
    ) {
      setTimeout(() => {
        setTransition(false);
        setStartTime((prevStartTime) =>
          datePlus(
            prevStartTime,
            currentTimeLevel.dateUnit,
            next
              ? -currentTimeLevel.amount * perPage
              : currentTimeLevel.amount * perPage
          )
        );
        setTranslateX(-perPage * ITEM_WIDTH);
        setTimeout(() => {
          setTransition(true);
        }, ANIME_TIME);
      }, ANIME_TIME);
    }
  };

  const handleChangeLevel = (zoomIn: boolean, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const index = timeLevels.findIndex(
      (item) => item.name === currentTimeLevel.name
    );
    if (
      (zoomIn && index + 1 === timeLevels.length) ||
      (!zoomIn && index === 0)
    ) {
      return;
    }
    setTranslateX(-perPage * ITEM_WIDTH);
    setCurrentTimeLevel(timeLevels[zoomIn ? index + 1 : index - 1]);
    if (clickX) {
      const ratio =
        (clickX + Math.abs(translateX)) / (perPage * 3 * ITEM_WIDTH);
      const startNode = timeNodeArray[0];
      const endNode = timeNodeArray[timeNodeArray.length - 1];
      if (startNode.time && endNode.time) {
        const timeDiff =
          datePlus(
            endNode.time,
            currentTimeLevel.dateUnit,
            currentTimeLevel.amount
          ).toMillis() - startNode.time.toMillis();
        const clickTime =
          datePlus(
            startNode.time,
            currentTimeLevel.dateUnit,
            -currentTimeLevel.amount / 2
          ).toMillis() +
          timeDiff * ratio;
        setStartTime(DateTime.fromMillis(clickTime));
      }
    }
    setClickX(null);
  };

  const handleToHome = () => {
    setStartTime(DateTime.fromMillis(initTime));
    setTranslateX(-perPage * ITEM_WIDTH);
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (containerRef && containerRef.current) {
      setClickX(event.nativeEvent.offsetX + translateX);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (e.deltaY < 0) {
        handleChangeLevel(false);
      } else {
        handleChangeLevel(true);
      }
    }, 200);
  };

  return (
    <div
      style={classes.root}
      ref={containerRef}
      onClick={handleClick}
      onWheel={handleWheel}
    >
      <div
        style={{
          ...classes.wrapper,
          ...{
            transition: transition
              ? `transform ${ANIME_TIME / 1000}s ease-out`
              : 'unset',
            transform: `translateX(${translateX}px)`,
          },
        }}
      >
        <div style={classes.contentWrapper}>
          <TimeNodes
            nodeGroups={nodeGroups}
            itemWidth={ITEM_WIDTH}
            itemHeight={nodeHeight}
          />
        </div>
        <div style={classes.timelineWrapper}>
          <svg
            viewBox={`0 0 ${perPage * 3 * ITEM_WIDTH} 56`}
            width={perPage * 3 * ITEM_WIDTH}
            height={56}
          >
            <defs>
              <g
                id="time-item"
                viewBox={`0,0,${ITEM_WIDTH},10`}
                preserveAspectRatio="xMinYMin meet"
              >
                <circle
                  cx={ITEM_WIDTH / 2}
                  cy="5"
                  r="5"
                  fill="#F5F5F5"
                  stroke="#F5F5F5"
                />
              </g>
            </defs>
            <defs>
              <g
                id="init-time"
                viewBox={`0,0,${ITEM_WIDTH},10`}
                preserveAspectRatio="xMinYMin meet"
              >
                <circle
                  cx={ITEM_WIDTH / 2}
                  cy="5"
                  r="5"
                  fill="#F75C2F"
                  stroke="#F75C2F"
                />
              </g>
            </defs>
            <path
              d={`M 0 28 H ${perPage * 3 * ITEM_WIDTH} 28`}
              stroke="#F5F5F5"
              strokeWidth="5"
            />
            {timeNodeArray.map((item) => (
              <TimeNode
                key={item.x}
                displayTime={item.displayTime}
                isKeyDate={item.isKeyDate}
                itemWidth={ITEM_WIDTH}
                x={item.x}
              />
            ))}
            {initTimeX ? <use href="#init-time" x={initTimeX} y={23} /> : null}
          </svg>
        </div>
      </div>

      {clickX ? (
        <div
          style={{
            ...classes.verticalLine,
            ...{
              left: `${clickX}px`,
            },
          }}
        ></div>
      ) : null}
      <div style={classes.left} onClick={(e) => handleClickMoveButton(true, e)}>
        <Icon name="left" width={30} height={30} />
      </div>
      <div
        style={classes.right}
        onClick={(e) => handleClickMoveButton(false, e)}
      >
        <Icon name="right" width={30} height={30} />
      </div>
      <div style={classes.zoomIn} onClick={(e) => handleChangeLevel(true, e)}>
        <Icon name="zoomIn" width={30} height={30} />
      </div>
      <div style={classes.zoomOut} onClick={(e) => handleChangeLevel(false, e)}>
        <Icon name="zoomOut" width={30} height={30} />
      </div>
      <div style={classes.home} onClick={handleToHome}>
        <Icon name="home" width={30} height={30} />
      </div>
    </div>
  );
};
