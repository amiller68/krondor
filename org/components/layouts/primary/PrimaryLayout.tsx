import Page from './../Page';
import Header from '@components/navigation/header/Header';
import React from 'react';
import styles from './PrimaryLayout.module.css';

export interface IPrimaryLayout extends React.ComponentPropsWithoutRef<'div'> {
  justify?: 'items-center' | 'items-start';
}

const PrimaryLayout: React.FC<IPrimaryLayout> = (props: IPrimaryLayout) => {
  return (
    <>
      <Page
        title={'Krondor'}
        description={'See what im up to'}
        url={'krondor.org'}
      >
        <div className={`min-h-screen flex flex-col ${props.justify}`}>
          <Header />
          <main className={styles.main}>{props.children}</main>
          <div className="m-auto" />
        </div>
      </Page>
    </>
  );
};

export default PrimaryLayout;
