import { ComponentStory, ComponentMeta } from '@storybook/react';
import Spinner from './Spinner';

// An Example of a Storybook Story - Minimum Required to get a story to show up

export default {
  title: 'components/spinners/Spinner',
  component: Spinner,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Spinner>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Spinner> = () => (
  <Spinner />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

