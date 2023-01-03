import styles from './Footer.module.scss';
import * as React from 'react';
import {
  INavigationItem,
  NavigationItem,
} from '@components/item/navigation/NavigationItem';

export interface IFooter extends React.ComponentPropsWithoutRef<'footer'> {}

const Footer: React.FC<IFooter> = ({ className, ...footerProps }) => {
  // Footer Navigation Items
  const footerNavigationItems: INavigationItem[] = [
    {
      key: 'twitter',
      item: 'Twitter',
      href: 'https://mobile.twitter.com/lord_krondor',
    },
    {
      key: 'documentation',
      item: 'Documentation',
      href: 'https://github.com/amiller68/me-www',
    },
  ];

  return (
    <footer
      {...footerProps}
      className={`w-full p-5 bg-slate-100 text-slate-500 ${className} ${styles.footer}`}
    >
      <div className={styles.navigation}>
        <nav className={styles.container}>
          <div className={'right'}>
            {footerNavigationItems.map((item) => {
              return (
                <div key={item.key} className="font-size-5vh">
                  <NavigationItem {...item} />
                </div>
              );
            })}
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
