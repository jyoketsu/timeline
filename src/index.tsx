import React, { FC, useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';
import TimeNode from './component/TimeNode';
import ReactStyle from './interface/ReactStyle';
import TimelineProps from './interface/Timeline';
import { datePlus } from './services/util';
import TimeLevel from './interface/TimeLevel';

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
    width: '5px',
    height: '100%',
    backgroundColor: '#C0C0C0',
    top: '0',
  },
};

const defaultTimeLevels: TimeLevel[] = [
  { name: 'day', dateUnit: 'day', amount: 1 },
  { name: 'week', dateUnit: 'day', amount: 7 },
  { name: 'month', dateUnit: 'month', amount: 1 },
  { name: 'year', dateUnit: 'year', amount: 1 },
  { name: 'ten-year', dateUnit: 'year', amount: 10 },
];

export const Timeline: FC<TimelineProps> = ({
  timeLevels = defaultTimeLevels,
  initTime = new Date().getTime(),
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTimeLevel, setCurrentTimeLevel] = useState<TimeLevel>(
    defaultTimeLevels[0]
  );
  const [startTime, setStartTime] = useState(DateTime.fromMillis(initTime));
  const [perPage, setPerPage] = useState(0);
  const [timeNodeArray, setTimeNodeArray] = useState<number[]>([]);
  const [translateX, setTranslateX] = useState(0);
  const [transition, setTransition] = useState(true);
  const [clickX, setClickX] = useState<number | null>(null);

  useEffect(() => {
    console.log('--------', containerRef);
    if (containerRef && containerRef.current) {
      const count = Math.ceil(containerRef.current.offsetWidth / ITEM_WIDTH);
      setPerPage(count);
      setTranslateX(-count * ITEM_WIDTH);
      setTimeNodeArray(Array.from(new Array(count * 3).keys()));
    }
  }, [containerRef]);

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
                key={item}
                index={item}
                initTime={startTime}
                timeLevel={currentTimeLevel}
              />
            ))}
          </svg>
        </div>
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0 }}>
        <button
          style={{ width: '100px' }}
          onClick={(e) => handleClickMoveButton(false, e)}
        >
          前
        </button>
        <button
          style={{ width: '100px' }}
          onClick={(e) => handleClickMoveButton(true, e)}
        >
          后
        </button>
        <button
          style={{ width: '100px' }}
          onClick={(e) => handleChangeLevel(true, e)}
        >
          放大
        </button>
        <button
          style={{ width: '100px' }}
          onClick={(e) => handleChangeLevel(false, e)}
        >
          缩小
        </button>
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
    </div>
  );
};
