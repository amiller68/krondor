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
  const config = new Config();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [manifest, setManifest] = React.useState<any>(null);
  const [posts, setPosts] = React.useState<IPost[]>([]);

  // Update the current manifest and history on cid change
  React.useEffect(() => {
    const updateCid = async () => {
      const blogCid = await config.getBlogCid();
      console.log('Found root CID:', blogCid);
      const manifest_path = `${blogCid}/manifest.json`;
      const [manifest] = await Promise.all([
        config.getCidFromGateways(manifest_path, 'json'),
      ]);
      console.log('Retrieved manifest: ', manifest.content);
      setManifest(manifest.content);
    };
    updateCid();
  }, []);

  // Update display when manifest is fetched or history is fetched
  React.useEffect(() => {
    if (manifest) {
      setPosts(manifest.posts);
      setLoading(false);
    }
  }, [manifest]);

  const applyFilters = () => {
    let filtered = posts;
    return filtered;
  };

  return (
    <>
      <div className={styles.container}>
        <section className={styles.main}>
          <span className={styles.title}>Blog</span>
          {loading && <p>Loading... </p>}
          <div className={blogStyles.table}>
            <BlogTable apply={applyFilters} />
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
