import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Timeline } from '../src';
import TimelineProps from '../src/interface/Timeline';

const meta: Meta = {
  title: 'Timeline',
  component: Timeline,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<TimelineProps> = (args) => <Timeline {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {
  children: (
    <div>
      <h1>title</h1>
      <h1>title</h1>
      <h1>titletitletitletitletitletitletitletitletitletitle</h1>
    </div>
  ),
};
