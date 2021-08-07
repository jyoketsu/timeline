import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
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
  getTimeByX,
} from './services/util';
import TimeLevel from './interface/TimeLevel';
import TimeNodeProps from './interface/TimeNode';
import Icon from './icon';
import NodeGroupItem from './interface/NodeGroupItem';
import TimeNodes from './component/TimeNodes';
import usePrevious from './hook/usePrevious';

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */

const ITEM_WIDTH = 100;
const TIMELINE_HEIGHT = 44;
const ANIME_TIME = 500;

let timeout: NodeJS.Timeout;
let clickX = 0;

const classes: ReactStyle = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    userSelect: 'none',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: `1fr ${TIMELINE_HEIGHT}px`,
  },
  contentWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
    minHeight: '360px',
  },
  timelineWrapper: {
    width: '100%',
    height: '100%',
    // cursor: 'move',
  },
  verticalLine: {
    position: 'absolute',
    width: '1px',
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
  actionButtonWrapper: {
    position: 'absolute',
    left: 0,
    bottom: '50px',
    backgroundColor: '#F2F2F2',
    width: '42px',
    height: '96px',
    borderRadius: '0 4px 4px 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  zoomIn: {
    cursor: 'pointer',
  },
  zoomOut: {
    cursor: 'pointer',
  },
  home: {
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
    keyDatePlace: 10,
  },
];

export const Timeline: FC<TimelineProps> = ({
  timeLevels = defaultTimeLevels,
  initTime = new Date().getTime(),
  backgroundColor = '#F2F2F2',
  nodeList,
  nodeHeight,
  handleDateChanged,
  handleClickAdd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTimeLevel, setCurrentTimeLevel] = useState<TimeLevel>(
    defaultTimeLevels[0]
  );
  const [startTime, setStartTime] = useState(DateTime.fromMillis(initTime));
  const [perPage, setPerPage] = useState(0);
  const [timeNodeArray, setTimeNodeArray] = useState<TimeNodeProps[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const preTranslateX: any = usePrevious(translateX);
  const [transition, setTransition] = useState(true);
  const [initTimeX, setInitTimeX] = useState<number | null>(null);
  const [nodeGroups, setNodeGroups] = useState<NodeGroupItem[][]>([]);
  const [started, setStarted] = useState(false);
  const [draggable, setDraggable] = useState(true);
  const [selectedNodeKey, setSelectedNodeKey] = useState<string | undefined>(
    undefined
  );
  const [hoverX, setHoverX] = useState(0);
  const [hoverY, setHoverY] = useState(0);

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

      for (let index = 0; index < perPage * 3; index++) {
        const time = datePlus(
          headTime,
          currentTimeLevel.dateUnit,
          index * currentTimeLevel.amount
        );
        const dispRes = getDispTime(time, currentTimeLevel);
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

  // useEffect(() => {
  //   if (handleSelectedDateChanged && clickX) {
  //     const ratio =
  //       (clickX + Math.abs(translateX)) / (perPage * 3 * ITEM_WIDTH);
  //     const startNode = timeNodeArray[0];
  //     const endNode = timeNodeArray[timeNodeArray.length - 1];
  //     if (startNode.time && endNode.time) {
  //       const timeDiff =
  //         datePlus(
  //           endNode.time,
  //           currentTimeLevel.dateUnit,
  //           currentTimeLevel.amount
  //         ).toMillis() - startNode.time.toMillis();
  //       const clickTime =
  //         datePlus(
  //           startNode.time,
  //           currentTimeLevel.dateUnit,
  //           -currentTimeLevel.amount / 2
  //         ).toMillis() +
  //         timeDiff * ratio;
  //       handleSelectedDateChanged(clickTime);
  //     }
  //   }
  // }, [clickX, translateX, perPage, timeNodeArray]);

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
        // 获取节点所在列
        const column = getNodeColumn(
          node.time,
          startDateNode,
          currentTimeLevel
        );

        const x = getNodeX(node.time, timeNodeArray);
        if (column >= 0 && column <= perPage * 3 - 1 && nodeGroups[column]) {
          nodeGroups[column].push({
            x,
            node,
          });
        }
      }
      setNodeGroups(nodeGroups);
    }
    return () => {
      setNodeGroups([]);
    };
  }, [nodeList, perPage, timeNodeArray]);

  // 点击左右移动按钮
  // const handleClickMoveButton = (next: boolean, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (
  //     !transition ||
  //     translateX === 0 ||
  //     translateX === -perPage * 2 * ITEM_WIDTH
  //   ) {
  //     return;
  //   }
  //   // 移动一个元素的宽度
  //   setTranslateX((prevX) => (next ? prevX + ITEM_WIDTH : prevX - ITEM_WIDTH));

  //   // 如果移到头了
  //   if (
  //     // 往右边到头
  //     (next && translateX + ITEM_WIDTH === 0) ||
  //     // 往左边到头
  //     (!next && translateX - ITEM_WIDTH === -perPage * 2 * ITEM_WIDTH)
  //   ) {
  //     setTimeout(() => {
  //       setTransition(false);
  //       setStartTime((prevStartTime) =>
  //         datePlus(
  //           prevStartTime,
  //           currentTimeLevel.dateUnit,
  //           next
  //             ? -currentTimeLevel.amount * perPage
  //             : currentTimeLevel.amount * perPage
  //         )
  //       );
  //       setTranslateX(-perPage * ITEM_WIDTH);
  //       setTimeout(() => {
  //         setTransition(true);
  //       }, ANIME_TIME);
  //     }, ANIME_TIME);
  //   }
  // };

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
    // setClickX(null);
  };

  const handleToHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTransition(true);
    // 这个设为0，是故意做个动画
    setTranslateX(0);
    setTimeout(() => {
      setTransition(false);
      setStartTime(DateTime.fromMillis(initTime));
      setTranslateX(-perPage * ITEM_WIDTH);
    }, ANIME_TIME);
  };

  // const handleClick = (event: React.MouseEvent) => {
  //   event.stopPropagation();
  //   if (containerRef && containerRef.current) {
  //     // setClickX(event.nativeEvent.offsetX + translateX);
  //   }
  // };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    e.preventDefault();
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (e.deltaY < 0) {
        handleChangeLevel(false);
      } else {
        handleChangeLevel(true);
      }
    }, 200);
  };

  const handleMoveStart = (e: React.MouseEvent<HTMLElement>) => {
    if (!draggable) {
      return;
    }
    if (e.button === 2) {
      e.preventDefault();
      clickX = e.clientX;
      setTransition(false);
      setStarted(true);
      setDraggable(false);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (started) {
      let movedX = 0;
      movedX = e.clientX - clickX;
      if (Math.abs(movedX) < 18) {
        return;
      }

      setTranslateX(translateX + movedX);
      clickX = e.clientX;
    } else if (draggable && containerRef && containerRef.current) {
      let movedX = 0;
      movedX = e.clientX - clickX;
      if (Math.abs(movedX) < 8) {
        return;
      }
      setHoverX(e.clientX - containerRef.current.offsetLeft);
      setHoverY(e.clientY - containerRef.current.offsetTop);
    }
  };

  const handleMoveEnd = (e: React.MouseEvent<HTMLElement>) => {
    if (started && e.button === 2) {
      setTransition(true);
      setStarted(false);
      const next = translateX > preTranslateX;
      // 移动整数个ITEM_WIDTH
      let moveX = 0;
      if (next) {
        moveX = Math.ceil(translateX / ITEM_WIDTH) * ITEM_WIDTH;
      } else {
        moveX = Math.floor(translateX / ITEM_WIDTH) * ITEM_WIDTH;
      }
      setTranslateX(moveX);

      setTimeout(() => {
        setTransition(false);
        const movedCount = Math.abs(
          (-perPage * ITEM_WIDTH - moveX) / ITEM_WIDTH
        );
        setStartTime((prevStartTime) =>
          datePlus(
            prevStartTime,
            currentTimeLevel.dateUnit,
            next
              ? -currentTimeLevel.amount * movedCount
              : currentTimeLevel.amount * movedCount
          )
        );
        setTranslateX(-perPage * ITEM_WIDTH);
        setDraggable(true);
        setHoverX(0);
        setHoverY(0);
      }, ANIME_TIME);
    } else if (e.button === 0) {
      clickAdd(e);
    }
  };

  const handleClickNode = (node: NodeGroupItem) => {
    setSelectedNodeKey(node.node._key);
    const column = getNodeColumn(
      node.node.time,
      timeNodeArray[0],
      currentTimeLevel
    );

    const selectedX = timeNodeArray[0].x + (column + 1) * ITEM_WIDTH;
    const middleX = Math.floor((perPage * 3) / 2) * ITEM_WIDTH;
    const diffX = selectedX - middleX;

    let movedX = 0;
    setTransition(true);
    setTranslateX((prevX) => {
      movedX = prevX - diffX;
      return movedX;
    });

    setTimeout(() => {
      setTransition(false);
      const movedCount = Math.abs(
        (-perPage * ITEM_WIDTH - movedX) / ITEM_WIDTH
      );
      setStartTime((prevStartTime) =>
        datePlus(
          prevStartTime,
          currentTimeLevel.dateUnit,
          diffX < 0
            ? -currentTimeLevel.amount * movedCount
            : currentTimeLevel.amount * movedCount
        )
      );
      setTranslateX(-perPage * ITEM_WIDTH);
    }, ANIME_TIME);
  };

  const timeline = useMemo(
    () => (
      <div style={classes.timelineWrapper}>
        <svg
          viewBox={`0 0 ${perPage * 3 * ITEM_WIDTH} ${TIMELINE_HEIGHT}`}
          width={perPage * 3 * ITEM_WIDTH}
          height={TIMELINE_HEIGHT}
        >
          <defs>
            <g
              id="time-item"
              viewBox={`0,0,${ITEM_WIDTH},12`}
              preserveAspectRatio="xMinYMin meet"
            >
              <path d={`M 0 0 v 12`} stroke="#ededed" />
              <path d={`M ${ITEM_WIDTH / 4} 0 v 12`} stroke="#ededed" />
              <path d={`M ${ITEM_WIDTH / 2} 0 v 12`} stroke="#C0C0C0" />
              <path d={`M ${ITEM_WIDTH * 0.75} 0 v 12`} stroke="#ededed" />
            </g>
            <g
              id="key-time-item"
              viewBox={`0,0,${ITEM_WIDTH},24`}
              preserveAspectRatio="xMinYMin meet"
            >
              <path d={`M 0 0 v 12`} stroke="#ededed" />
              <path d={`M ${ITEM_WIDTH / 4} 0 v 12`} stroke="#ededed" />
              <path d={`M ${ITEM_WIDTH / 2} 0 v 24`} stroke="#808080" />
              <path d={`M ${ITEM_WIDTH * 0.75} 0 v 12`} stroke="#ededed" />
            </g>
            <g
              id="init-time"
              viewBox={`0,0,${ITEM_WIDTH},10`}
              preserveAspectRatio="xMinYMin meet"
            >
              <circle cx={ITEM_WIDTH / 2} cy="5" r="5" fill="#F75C2F" />
            </g>
            <g id="dot" viewBox={`0,0,5,5`} preserveAspectRatio="xMinYMin meet">
              <circle cx="2.5" cy="2.5" r="2.5" fill="#919191" />
            </g>
          </defs>

          {/* 背景，填充白色 */}
          <rect
            x={0}
            y={0}
            width={perPage * 3 * ITEM_WIDTH}
            height={TIMELINE_HEIGHT}
            fill="#FFF"
          />
          {/* 时间轴上方横线 */}
          <path
            d={`M 0 0 H ${perPage * 3 * ITEM_WIDTH}`}
            stroke="#e5e5e5"
            strokeWidth="1"
          />
          {/* 时间轴下方横线 */}
          <path
            d={`M 0 ${TIMELINE_HEIGHT} H ${perPage * 3 * ITEM_WIDTH}`}
            stroke="#e5e5e5"
            strokeWidth="1"
          />
          {/* 时间坐标 */}
          {timeNodeArray.map((item) => (
            <TimeNode
              key={item.x}
              displayTime={item.displayTime}
              isKeyDate={item.isKeyDate}
              itemWidth={ITEM_WIDTH}
              x={item.x}
            />
          ))}
          {/* 子节点时间（灰点） */}
          {nodeGroups.map((group) =>
            group.map((node) => (
              <use
                key={node.node._key}
                href="#dot"
                x={node.x + ITEM_WIDTH / 2 - 2.5}
                y={0}
              />
            ))
          )}
          {/* 初始化时间（红点） */}
          {initTimeX ? <use href="#init-time" x={initTimeX} y={0} /> : null}
        </svg>
      </div>
    ),
    [timeNodeArray, nodeGroups]
  );

  const contentNodes = useMemo(
    () => (
      <div style={classes.contentWrapper}>
        <TimeNodes
          nodeGroups={nodeGroups}
          itemWidth={ITEM_WIDTH}
          itemHeight={nodeHeight}
          selectedKey={selectedNodeKey}
          handleClickNode={handleClickNode}
        />
      </div>
    ),
    [nodeGroups]
  );

  const clickAdd = (event: React.MouseEvent<HTMLElement>) => {
    if (handleClickAdd) {
      handleClickAdd(
        getTimeByX(
          hoverX - translateX,
          ITEM_WIDTH,
          timeNodeArray,
          currentTimeLevel
        ),
        event.clientX,
        event.clientY
      );
    }
  };

  return (
    <div
      style={{
        ...classes.root,
        backgroundColor: backgroundColor,
        cursor: started ? 'grabbing' : draggable ? 'grab' : 'not-allowed',
      }}
      ref={containerRef}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMoveStart}
      onMouseUp={handleMoveEnd}
      onMouseLeave={handleMoveEnd}
      onMouseMove={handleMove}
      // onClick={handleClick}
    >
      {hoverX && !started && draggable && handleClickAdd ? (
        <div
          style={{
            ...classes.verticalLine,
            ...{
              left: `${hoverX}px`,
            },
          }}
        ></div>
      ) : null}
      {hoverX && hoverY && !started && draggable && handleClickAdd ? (
        <div
          style={{
            position: 'absolute',
            left: `${hoverX - 11}px`,
            top: `${hoverY - 33}px`,
          }}
        >
          <Icon name="plus" width={22} height={22} fill="#FF4500" />
        </div>
      ) : null}
      {hoverX && !started && draggable && handleClickAdd ? (
        <span
          style={{
            position: 'absolute',
            left: `${hoverX - 50}px`,
            top: '8px',
            color: '#FF4500',
            fontSize: '10px',
            fontWeight: 800,
          }}
        >
          {DateTime.fromMillis(
            getTimeByX(
              hoverX - translateX,
              ITEM_WIDTH,
              timeNodeArray,
              currentTimeLevel
            )
          ).toFormat('yyyy-LL-dd T')}
        </span>
      ) : null}
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
        {contentNodes}
        {timeline}
      </div>
      <div style={classes.actionButtonWrapper}>
        <div
          style={classes.zoomIn}
          onClick={(e) => handleChangeLevel(false, e)}
        >
          <Icon name="zoomIn" width={22} height={22} />
        </div>
        <div
          style={classes.zoomOut}
          onClick={(e) => handleChangeLevel(true, e)}
        >
          <Icon name="zoomOut" width={22} height={22} />
        </div>
        <div style={classes.home} onClick={handleToHome}>
          <Icon name="home" width={18} height={18} />
        </div>
      </div>
    </div>
  );
};
