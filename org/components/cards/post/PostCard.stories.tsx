import { ComponentStory, ComponentMeta } from '@storybook/react';
import PostCard, { IPostCard } from './PostCard';
import { mockFileCardProps } from './PostCard.mocks';

// An Example of a Storybook Story - Minimum Required to get a story to show up

export default {
  title: 'components/cards/PostCard',
  component: PostCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PostCard>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PostCard> = (args: IPostCard) => (
  <PostCard {...args} />
);

export const Base = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Base.args = {
  ...mockFileCardProps.base,
} as IPostCard;
