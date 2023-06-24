import { IBlogTable } from './BlogTable';

const base = {
  apply: () => [
    {
      title: 'Post 1',
      name: 'post-1',
      cid: 'QmVhcmVy',
      date: '2020-01-01',
    },
  ],
} as IBlogTable;

export const mockFileCardProps = {
  base,
};
