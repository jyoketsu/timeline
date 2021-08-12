import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  getTwoNodeDiffTime,
} from './services/util';
import TimeLevel from './interface/TimeLevel';
import TimeNodeProps from './interface/TimeNode';
import Icon from './icon';
import NodeGroupItem from './interface/NodeGroupItem';
import TimeNodes from './component/TimeNodes';
import usePrevious from './hook/usePrevious';
import VerticalBars from './component/VerticalBars';

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
let spaceKeyDown = false;

const classes: ReactStyle = {
  root: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    userSelect: 'none',
    outline: 'none',
  },
  wrapper: {
    position: 'relative',
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

export const Timeline = React.forwardRef(
  (
    {
      timeLevels = defaultTimeLevels,
      initTime = new Date().getTime(),
      backgroundColor = '#F2F2F2',
      shiftX = 0,
      nodeList,
      nodeHeight,
      handleDateChanged,
      handleClickAdd,
      wheelable = true,
    }: TimelineProps,
    ref
  ) => {
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
    // 初始化时间（红点）的x位置
    const [initTimeX, setInitTimeX] = useState<number | null>(null);
    const [nodeGroups, setNodeGroups] = useState<NodeGroupItem[][]>([]);
    const [started, setStarted] = useState(false);
    const [draggable, setDraggable] = useState(true);
    const [selectedNodeKey, setSelectedNodeKey] = useState<string | undefined>(
      undefined
    );
    const [hoverX, setHoverX] = useState(0);
    const [hoverY, setHoverY] = useState(0);
    const [zoomRatio, setZoomRatio] = useState(1);
    const [transformOrigin, setTransformOrigin] = useState(0);

    // 暴露方法
    useImperativeHandle(ref, () => ({
      handleChangeLevel,
    }));

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

    const handleChangeLevel = (
      zoomIn: boolean,
      mouseZoom?: boolean,
      e?: React.MouseEvent
    ) => {
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
      const hoverPosition = mouseZoom
        ? hoverX - translateX
        : ((perPage * 3) / 2) * ITEM_WIDTH;
      setTransformOrigin(hoverPosition);
      setZoomRatio(zoomIn ? 0.9 : 1.1);
      setTimeout(() => {
        setTimeNodeArray([]);
        setNodeGroups([]);
        setZoomRatio(1);
        const nextLevel = timeLevels[zoomIn ? index + 1 : index - 1];
        if (mouseZoom && hoverX) {
          const hoverTime = getTimeByX(
            hoverPosition,
            ITEM_WIDTH,
            timeNodeArray,
            currentTimeLevel
          );
          const middlePosition = Math.floor((perPage * 3) / 2) * ITEM_WIDTH;
          const diffPosition = hoverPosition - middlePosition;
          const twoNodeDiffTime = getTwoNodeDiffTime(nextLevel);
          // 获取diffTime
          // ITEM_WIDTH=twoNodeDiffTime
          // diffPosition=diffTime
          // diffTime=(twoNodeDiffTime*diffPosition)ITEM_WIDTH
          const diffTime = (twoNodeDiffTime * diffPosition) / ITEM_WIDTH;
          const middleTime = hoverTime - diffTime;
          setStartTime(DateTime.fromMillis(middleTime));
          setTranslateX(-perPage * ITEM_WIDTH);
        }
        setCurrentTimeLevel(nextLevel);
      }, ANIME_TIME);
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

    const handleMoveStart = (e: React.MouseEvent<HTMLElement>) => {
      if (!draggable) {
        return;
      }
      if (e.button === 2 || (spaceKeyDown && e.button === 0)) {
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
        setHoverX(e.clientX - containerRef.current.offsetLeft + shiftX);
        setHoverY(e.clientY - containerRef.current.offsetTop);
      }
    };

    const handleMoveEnd = (e: React.MouseEvent<HTMLElement>) => {
      if (started && (e.button === 2 || (spaceKeyDown && e.button === 0))) {
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
            style={{
              transform: `scale(${zoomRatio},1)`,
              transformOrigin: `${transformOrigin}px center`,
              transition:
                zoomRatio === 1 ? 'none' : `transform ${ANIME_TIME / 1000}s`,
            }}
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
              <g
                id="dot"
                viewBox={`0,0,5,5`}
                preserveAspectRatio="xMinYMin meet"
              >
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
      [timeNodeArray, nodeGroups, zoomRatio, transformOrigin]
    );

    const contentNodes = useMemo(
      () => (
        <TimeNodes
          nodeGroups={nodeGroups}
          itemWidth={ITEM_WIDTH}
          itemHeight={nodeHeight}
          selectedKey={selectedNodeKey}
          handleClickNode={handleClickNode}
        />
      ),
      [nodeGroups]
    );

    const contentVerticalBars = useMemo(
      () => (
        <VerticalBars
          nodeGroups={nodeGroups}
          itemWidth={ITEM_WIDTH}
          itemHeight={nodeHeight}
          selectedKey={selectedNodeKey}
        />
      ),
      [nodeGroups]
    );

    const clickAdd = (event: React.MouseEvent<HTMLElement>) => {
      if (handleClickAdd && !spaceKeyDown) {
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

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === ' ' && !spaceKeyDown) {
        spaceKeyDown = true;
      }
    };
    const handleKeyUp = (event: React.KeyboardEvent) => {
      if (event.key === ' ') {
        spaceKeyDown = false;
      }
    };

    const handleWheel = (e: any) => {
      if (wheelable) {
        clearTimeout(timeout);
        const up = e.deltaY < 0;
        timeout = setTimeout(() => {
          if (up) {
            handleChangeLevel(false, true);
          } else {
            handleChangeLevel(true, true);
          }
        }, 200);
      }
    };

    return (
      <div
        style={{
          ...classes.root,
          backgroundColor: backgroundColor,
          cursor: started
            ? 'grabbing'
            : draggable
            ? handleClickAdd
              ? 'default'
              : 'grab'
            : 'not-allowed',
        }}
        tabIndex={-1}
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={handleMoveStart}
        onMouseUp={handleMoveEnd}
        onMouseLeave={handleMoveEnd}
        onMouseMove={handleMove}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={clickAdd}
        onWheel={handleWheel}
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
              top: `${hoverY - 23}px`,
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
              top: '32px',
              color: '#FF4500',
              fontSize: '10px',
              fontWeight: 800,
              whiteSpace: 'nowrap',
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
          <div
            style={{
              ...classes.contentWrapper,
              ...{
                transform: `scale(${zoomRatio},1)`,
                transformOrigin: `${transformOrigin}px center`,
                transition:
                  zoomRatio === 1 ? 'none' : `transform ${ANIME_TIME / 1000}s`,
              },
            }}
          >
            {contentVerticalBars}
            {contentNodes}
          </div>
          {timeline}
        </div>
        <div style={classes.actionButtonWrapper}>
          <div
            style={classes.zoomIn}
            onClick={(e) => handleChangeLevel(false, false, e)}
          >
            <Icon name="zoomIn" width={22} height={22} />
          </div>
          <div
            style={classes.zoomOut}
            onClick={(e) => handleChangeLevel(true, false, e)}
          >
            <Icon name="zoomOut" width={22} height={22} />
          </div>
          <div style={classes.home} onClick={handleToHome}>
            <Icon name="home" width={18} height={18} />
          </div>
        </div>
      </div>
    );
  }
);
