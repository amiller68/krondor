import PrimaryLayout from '@components/layouts/primary/PrimaryLayout';
import styles from '@styles/pages/Home.module.scss';
import { NextPageWithLayout } from './page';
import * as React from 'react';
import { P } from '@components/typography/Typography';
import Link from 'next/link';

const Home: NextPageWithLayout = (_props: any) => {
  return (
    <>
      <div className={styles.container}>
        <section className={styles.main}>
          <span className={styles.title}>Welcome to Krondor.org</span>
          <P>
            This is my place to share my thoughts, ideas, and projects. I hope
            to have more to show soon, but for now poke around that start of my{' '}
            <Link href="/blog/index" className={'link'}>
              blog
            </Link>
            , or check out my{' '}
            <Link href="https://github.com/amiller68/krondor-org" className={'link'}>
              documentation
            </Link>{' '}
            for this site{' '}
          </P>
        </section>
      </div>
    </>
  );
};

export default Home;

Home.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
