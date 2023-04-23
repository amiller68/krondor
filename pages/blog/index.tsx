import PrimaryLayout from '@components/layouts/primary/PrimaryLayout';
import blogStyles from '@styles/pages/Blog.module.scss';
import styles from '@styles/pages/Home.module.scss';
import { NextPageWithLayout } from '../page';
import * as React from 'react';
// import PostCard, { IPostCard } from '@components/cards/post/PostCard';
import BlogTable from '@components/tables/blog/BlogTable';
import Post from '@lib/entities/post';

const Blog: NextPageWithLayout = (_props: any) => {
  // We don't have a real backend yet, so we'll just code the posts in here.
  const posts: Post[] = [
    {
      title: 'Welcome to Krondor.org',
      date: '2021-01-01',
      cid: 'bafkreiai4g4rxn3kkeqyi3vi4ovjs4ewugqxpek4x2kr7tlhbmhd2gw6nq',
    },
  ];
  return (
    <>
      <div className={styles.container}>
        <section className={styles.main}>
          <span className={styles.title}>Blog</span>
          <div className={blogStyles.table}>
            <BlogTable posts={posts} />
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;

Blog.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
