import PrimaryLayout from '@components/layouts/primary/PrimaryLayout';
import blogStyles from '@styles/pages/Blog.module.scss';
import styles from '@styles/pages/Home.module.scss';
import { NextPageWithLayout } from '../page';
import * as React from 'react';
import BlogTable from '@components/tables/blog/BlogTable';
import Config from '@config/index';

// Note: this is what is contained within <blog_cid>/manifest.json.posts[0]
export interface IPost {
  title: string;
  date: string;
  name: string;
  cid: string;
}

const Blog: NextPageWithLayout = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [posts, setPosts] = React.useState<IPost[]>([]);

  // Update the current manifest and history on cid change
  React.useEffect(() => {
    const updateCid = async () => {
      const config = new Config();
      const blogCid = await config.getBlogCid();
      // Check if root is empty string 
      if (blogCid === "") {
        console.log("Empty Root! Try publishing something :)")
        return;
      }
      console.log('Found root CID:', blogCid);
      const manifest_path = `${blogCid}/manifest.json`;
      const [manifest] = await Promise.all([
        config.getCidFromGateways(manifest_path, 'json'),
      ]);
      // @ts-ignore
      setPosts(manifest.content.posts);
    };
    updateCid().then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <div className={styles.container}>
        <section className={styles.main}>
          <span className={styles.title}>Blog</span>
          {loading && <p>Loading... </p>}
          { !loading && posts.length === 0 && <p>No posts found! Try publishing something :)</p>}
          <div className={blogStyles.table}>
            <BlogTable apply={() => posts} />
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
