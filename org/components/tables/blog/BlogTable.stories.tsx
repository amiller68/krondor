import { ComponentStory, ComponentMeta } from '@storybook/react';
import BlogTable from './BlogTable';
import { mockFileCardProps } from './BlogTable.mocks';

// An Example of a Storybook Story - Minimum Required to get a story to show up

export default {
  title: 'components/tables/BlogTable',
  component: BlogTable,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof BlogTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BlogTable> = (args) => (
  <BlogTable {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockFileCardProps.base,
};
