import Post from '../../../lib/entities/post';
import { IBlogTable } from './BlogTable';

const base = {
  posts: [
    {
      title: 'Post 1',
      cid: 'QmVhcmVy',
      date: '2020-01-01',
    } as Post,
  ],
} as IBlogTable;

export const mockFileCardProps = {
  base,
};
