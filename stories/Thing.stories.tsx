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

const nowTime = new Date().getTime();
let timeList = [
  {
    time: nowTime,
    itemRender: function () {
      return (
        <div style={{ color: '#FFF', height: '40px', border: '1px solid' }}>
          测试
        </div>
      );
    },
  },
];
for (let index = 1; index < 11; index++) {
  timeList.push({
    time: nowTime + index * 3600000,
    itemRender: function () {
      return (
        <div style={{ color: '#FFF', height: '40px', border: '1px solid' }}>
          测试
        </div>
      );
    },
  });
  if (index % 3 === 0) {
    timeList.push({
      time: nowTime + index * 3600000 + 36000,
      itemRender: function () {
        return (
          <div style={{ color: '#FFF', height: '40px', border: '1px solid' }}>
            测试
          </div>
        );
      },
    });
  }
  timeList.push({
    time: nowTime - index * 3600000,
    itemRender: function () {
      return (
        <div style={{ color: '#FFF', height: '40px', border: '1px solid' }}>
          测试
        </div>
      );
    },
  });
}

Default.args = {
  nodeList: timeList,
  nodeHeight: 40,
  handleSelectedDateChanged: (clickTime: number) => {
    console.log(
      '---handleSelectedDateChanged---',
      DateTime.fromMillis(clickTime).toFormat('yyyy-LL-dd TT')
    );
  },
  handleDateChanged: (startDate: number, endDate: number, amount: number) => {
    console.log(
      '---handleDateChanged---',
      DateTime.fromMillis(startDate).toFormat('yyyy-LL-dd TT'),
      DateTime.fromMillis(endDate).toFormat('yyyy-LL-dd TT'),
      amount
    );
  },
};
