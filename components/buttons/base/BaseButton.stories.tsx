import { ComponentStory, ComponentMeta } from '@storybook/react';
import BaseButton, { IBaseButton } from './BaseButton';
import { mockBaseButtonProps } from './BaseButton.mocks';

// An Example of a Storybook Story - Minimum Required to get a story to show up

export default {
  title: 'components/buttons/base/BaseButton',
  component: BaseButton,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof BaseButton>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BaseButton> = (args: IBaseButton) => (
  <BaseButton {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockBaseButtonProps.base,
} as IBaseButton;
