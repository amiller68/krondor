import Page from './../Page';
import Footer from '../../navigation/footer/Footer';
import Header from '../../navigation/header/Header';
import React from 'react';
import styles from './PrimaryLayout.module.scss';

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
          <Footer />
        </div>
      </Page>
    </>
  );
};

export default PrimaryLayout;
