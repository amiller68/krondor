import PrimaryLayout from '@components/layouts/primary/PrimaryLayout';
import styles from '@styles/pages/About.module.scss';
import { NextPageWithLayout } from './page';
import * as React from 'react';
import { P } from '@components/typography/Typography';
import { classNames } from '@lib/utilities/misc';
import Link from 'next/link';
import {
  NavigationItem,
  INavigationItem,
} from '@components/item/navigation/NavigationItem';

const About: NextPageWithLayout = (_props: any) => {
  const contacts: INavigationItem[] = [
    {
      key: 'email',
      item: 'Email',
      href: 'mailto:al@krondor.org',
    },
    {
      key: 'github',
      item: 'Github',
      href: 'https://github.com/amiller68',
    },
    {
      key: 'twitter',
      item: 'Twitter',
      href: 'https://twitter.com/lord_krondor',
    },
    {
      key: 'discord',
      item: 'Discord',
      href: 'https://discordapp.com/users/krondor#5903',
    },
  ];

  return (
    <>
      <div className={styles.container}>
        <section className={classNames('', styles.main)}>
          <span className={'blockTitle'}>About Me.</span>
          <P>
            im a software engineer working with{' '}
            <Link href={'https://banyan.computer'} className={'link'}>
              {' '}
              banyan{' '}
            </Link>
            on novel Web3 products. In my free time I enjoy working on /
            learning about web3, technology, and history. Feel free to reach out
            to me on{' '}
          </P>
          {contacts.map((contact) => {
            return (
              <div key={contact.key} className={'item'}>
                <NavigationItem {...contact} />
              </div>
            );
          })}
        </section>
      </div>
    </>
  );
};

export default About;

About.getLayout = (page) => {
  return <PrimaryLayout>{page}</PrimaryLayout>;
};
