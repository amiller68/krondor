import PrimaryLayout from '@components/layouts/primary/PrimaryLayout';
import styles from '@styles/pages/Blog.module.scss';
import { NextPageWithLayout } from '../page';
import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';
import Spinner from '@components/spinners/Spinner';
import { P } from '@components/typography/Typography';

// This is the blog post page component. It is responsible for fetching the post and pulling
// content from IPFS and rendering it.
const Post: NextPageWithLayout = (_props: any) => {
  const router = useRouter();
  const [content, setContent] = React.useState('');
  const [error, setError] = React.useState('');
  // Fetch content from IPFS on page load.
  React.useEffect(() => {
    const { cid } = router.query;
    fetch('/api/blog/' + cid)
      .then((r) => r.json())
      .then((c) => {
        setContent(c.content);
        if (c.error) {
          setError(c.error);
        }
      });
  }, [router]);
  return (
    <>
      <section className={styles.container}>
        {content ? (
          error ? (
            <div>
              <ReactMarkdown className={styles.markdown}>{error}</ReactMarkdown>
              <P> Sometimes IPFS can be unreliable. Try reloading the page.</P>
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
