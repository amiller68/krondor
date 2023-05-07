import styles from './BlogTable.module.scss';
import Link from 'next/link';
import { Table } from '@nextui-org/react';
import Post from '@lib/entities/post';

export interface IBlogTable {
  posts: Post[];
}

const BlogTable: React.FC<IBlogTable> = ({ posts }) => {
  const columns = [
    {
      key: 'title',
      label: 'Title',
    },
    { key: 'date', label: 'Date' },
  ];
  // Get the date time from the timestamp
  return (
    <Table compact shadow={false}>
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key}>{column.label}</Table.Column>
        )}
      </Table.Header>
      <Table.Body items={posts}>
        {(item) => (
          <Table.Row key={item.cid}>
            <Table.Cell>
              <Link href={`/blog/${item.cid}`} className={styles.inlineLink}>
                <h4>{item.title}</h4>
              </Link>
            </Table.Cell>
            <Table.Cell>{item.date}</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export default BlogTable;
