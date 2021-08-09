import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Timeline } from '../src';
import TimelineProps from '../src/interface/Timeline';
import { DateTime } from 'luxon';

const meta: Meta = {
  title: 'Timeline',
  component: Timeline,
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<TimelineProps> = (args) => <Timeline {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

interface Props {
  text: string;
}
function Item({ text }: Props) {
  return (
    <div
      style={{
        height: '20px',
        lineHeight: '20px',
        padding: '0 8px',
        border: '1px solid #c7c7c7',
        borderRadius: '4px 4px 4px 0',
        backgroundColor: '#e5e5e5',
        color: '#969696',
        transition: 'all 0.5s',
        cursor: 'pointer',
      }}
    >
      {text}
    </div>
  );
}

const nowTime = new Date().getTime();
let timeList = [
  {
    _key: nowTime.toString(),
    time: nowTime,
    itemRender: function () {
      return <Item text="测试测试测试测试测试测试测试测试测" />;
    },
  },
];
for (let index = 1; index < 110; index++) {
  timeList.push({
    _key: (nowTime + index * 3600000).toString(),
    time: nowTime + index * 3600000 * 1.2 + 36000,
    itemRender: function () {
      return <Item text="测试" />;
    },
  });
  if (index % 3 === 0) {
    timeList.push({
      _key: (nowTime + index * 3600000 + 36000).toString(),
      time: nowTime + index * 3600000 * 1.4,
      itemRender: function () {
        return <Item text="测试" />;
      },
    });
  }
  timeList.push({
    _key: (nowTime - index * 3600000).toString(),
    time: nowTime - index * 3600000 * 2.1,
    itemRender: function () {
      return <Item text="测试" />;
    },
  });
}

Default.args = {
  nodeList: timeList,
  nodeHeight: 20,
  handleDateChanged: (startDate: number, endDate: number, amount: number) => {
    console.log(
      '---handleDateChanged---',
      DateTime.fromMillis(startDate).toFormat('yyyy-LL-dd TT'),
      DateTime.fromMillis(endDate).toFormat('yyyy-LL-dd TT'),
      amount
    );
  },
  handleClickAdd: (time: number, x: number, y: number) => {
    console.log('---handleClickAdd---', time, x, y);
  },
};
