import * as React from 'react';
import styles from './Header.module.css';
import Tag from '@components/tags/Tag';
import useMenu from './useMenu';
import { NavigationItem } from '@components/item/navigation/NavigationItem';
import { classNames } from '@lib/utilities/misc';

export interface IHeader extends React.ComponentPropsWithoutRef<'header'> {}

const Header: React.FC<IHeader> = (props: IHeader) => {
  const menu = useMenu();
  return (
    <>
      <header
        {...props}
        className={classNames(
          `w-full flex flex-row justify-between`,
          props.className
        )}
      >
        <div className={styles.navigation}>
          <nav className={styles.container}>
            <div className="left">
              <NavigationItem
                key={'logo'}
                item={
                  <span className={'logo'}>
                    {' '}
                    <Tag>krondor.</Tag>{' '}
                  </span>
                }
                href={'/'}
              />
            </div>
            <div className="right">
              {menu.map((item) => {
                return (
                  <div key={item.key} className="font-size-5vh">
                    <NavigationItem {...item} />
                  </div>
                );
              })}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
