import PrimaryLayout from '@components/layouts/primary/PrimaryLayout';
import styles from '@styles/pages/Blog.module.scss';
import { NextPageWithLayout } from '../page';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import Spinner from '@components/spinners/Spinner';
import { P } from '@components/typography/Typography';
import getBlogCid from '@lib/eth';
import getCidFromGateways from '@lib/ipfs';

// This is the blog post page component. It is responsible for fetching the post and pulling
// content from IPFS and rendering it.
const Post: NextPageWithLayout = (_props: any) => {
  const router = useRouter();
  const [content, setContent] = React.useState('');
  const [ loading, setLoading ] = React.useState<boolean>(true);
  const [error, setError] = React.useState('');
  // Fetch content from IPFS on page load.
  React.useEffect(() => {
    const cid = router.query.name as string;
    const init = async () => {
      const blogCid = await getBlogCid();
      const post_path = `${blogCid}/${cid}`;
      const post = await getCidFromGateways(post_path, 'text');
      if (post.error) {
        setError(post.error);
      } 
      else if (typeof post.content === 'string') {
        setContent(post.content);
      } else {
        setError('Unknown error.');
      }
      setLoading(false);
    };
    init();
  }, [router]);
  return (
    <>
      <section className={styles.container}>
        {!loading ? (
          error ? (
            <div>
              <ReactMarkdown className={styles.markdown}>{error}</ReactMarkdown>
              <P> Sometimes IPFS can be unreliable. Try reloading the page.</P>
              <P> Error: {error} </P>
            </div>
          ) : (
            <ReactMarkdown className={styles.markdown}>{content}</ReactMarkdown>
          )
        ) : (
          <section className={styles.main}>
            <P>Loading content from IPFS Gateway...</P>
            <Spinner />
          </section>
        )}
      </section>
    </>
  );
};

export default Post;

Post.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
