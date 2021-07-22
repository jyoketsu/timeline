import React, { FC, useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import TimeNode from './component/TimeNode';
import ReactStyle from './interface/ReactStyle';
import TimelineProps from './interface/Timeline';
import { datePlus, getDispTime } from './services/util';
import TimeLevel from './interface/TimeLevel';
import TimeNodeProps from './interface/TimeNode';
import Icon from './icon';

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */

const ITEM_WIDTH = 100;
const ANIME_TIME = 500;

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
  },
  right: {
    position: 'absolute',
    right: '8px',
    bottom: '60px',
    cursor: 'pointer',
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
};

const defaultTimeLevels: TimeLevel[] = [
  { name: 'hour', dateUnit: 'hour', amount: 1 },
  { name: 'day', dateUnit: 'day', amount: 1 },
  { name: 'week', dateUnit: 'day', amount: 7 },
  { name: 'month', dateUnit: 'month', amount: 1 },
  { name: 'year', dateUnit: 'year', amount: 1 },
  { name: 'ten-year', dateUnit: 'year', amount: 10 },
];

export const Timeline: FC<TimelineProps> = ({
  timeLevels = defaultTimeLevels,
  initTime = new Date().getTime(),
  handleDateChanged,
  handleSelectedDateChanged,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTimeLevel, setCurrentTimeLevel] = useState<TimeLevel>(
    defaultTimeLevels[0]
  );
  // 开始时间，设为传入时间的零点
  const [startTime, setStartTime] = useState(
    DateTime.fromMillis(
      new Date(new Date(initTime).toLocaleDateString()).getTime()
    )
  );
  const [perPage, setPerPage] = useState(0);
  const [timeNodeArray, setTimeNodeArray] = useState<TimeNodeProps[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [transition, setTransition] = useState(true);
  const [clickX, setClickX] = useState<number | null>(null);

  useEffect(() => {
    console.log('----containerRef----', containerRef);
    if (containerRef && containerRef.current) {
      const count = Math.ceil(containerRef.current.offsetWidth / ITEM_WIDTH);
      setPerPage(count);
      setTranslateX(-count * ITEM_WIDTH);
    }
  }, [containerRef]);

  useEffect(() => {
    if (perPage) {
      let array: TimeNodeProps[] = [];
      for (let index = 0; index < perPage * 3; index++) {
        const time = datePlus(
          startTime,
          currentTimeLevel.dateUnit,
          index * currentTimeLevel.amount
        );
        const dispTime = getDispTime(time, currentTimeLevel.dateUnit);
        array.push({
          time,
          displayTime: dispTime,
          x: index * ITEM_WIDTH,
        });
      }
      setTimeNodeArray(array);
      if (handleDateChanged) {
        const startDate = array[0].time?.toMillis();
        const endDate = array[array.length - 1].time?.toMillis();
        if (startDate && endDate) {
          handleDateChanged(startDate, endDate, perPage);
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

  const handleChangeLevel = (zoomIn: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const index = timeLevels.findIndex(
      (item) => item.name === currentTimeLevel.name
    );
    if (
      (zoomIn && index + 1 === timeLevels.length) ||
      (!zoomIn && index === 0)
    ) {
      return;
    }
    setCurrentTimeLevel(timeLevels[zoomIn ? index + 1 : index - 1]);
  };

  const handleClick = (event: React.MouseEvent) => {
    if (containerRef && containerRef.current) {
      setClickX(event.clientX - containerRef.current.offsetLeft);
    }

    // setClickX(event.nativeEvent.offsetX);
  };

  return (
    <div style={classes.root} ref={containerRef} onClick={handleClick}>
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
        <div style={classes.contentWrapper}>{children}</div>
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
            <path
              d={`M 0 28 H ${perPage * 3 * ITEM_WIDTH} 28`}
              stroke="#F5F5F5"
              strokeWidth="5"
            />
            {timeNodeArray.map((item) => (
              <TimeNode
                key={item.x}
                displayTime={item.displayTime}
                x={item.x}
              />
            ))}
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
      <div
        style={classes.left}
        onClick={(e) => handleClickMoveButton(false, e)}
      >
        <Icon name="left" width={30} height={30} />
      </div>
      <div
        style={classes.right}
        onClick={(e) => handleClickMoveButton(true, e)}
      >
        <Icon name="right" width={30} height={30} />
      </div>
      <div style={classes.zoomIn} onClick={(e) => handleChangeLevel(true, e)}>
        <Icon name="zoomIn" width={30} height={30} />
      </div>
      <div style={classes.zoomOut} onClick={(e) => handleChangeLevel(false, e)}>
        <Icon name="zoomOut" width={30} height={30} />
      </div>
    </div>
  );
};
