import PrimaryLayout from '@components/layouts/primary/PrimaryLayout';
import styles from '@styles/pages/Blog.module.scss';
import { NextPageWithLayout } from '../page';
import * as React from 'react';
import PostCard, { IPostCard } from '@components/cards/post/PostCard';

const Blog: NextPageWithLayout = (_props: any) => {
  // We don't have a real backend yet, so we'll just code the posts in here.
  const posts: IPostCard[] = [
    {
      title: 'Welcome to Krondor.org',
      date: '2023-01-02',
      cid: 'bafkreihrvawjlehykbydxhaxy43wzittt3lz46f3sqzmswldgeop56wh3q',
    },
  ];
  return (
    <>
      <div className={styles.container}>
        <section className={styles.main}>
          <span className={'blockTitle'}>Blog.</span>
          {posts.map((post: IPostCard) => {
            return (
              <div className={styles.post} key={post.title}>
                <PostCard title={post.title} date={post.date} cid={post.cid} />
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
};

export default Blog;

Blog.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
