import * as React from 'react';
import { NavigationItem } from '@components/item/navigation/NavigationItem';
import { IHeader } from './Header';
import { ReactNode } from 'react';
import { INavigationItem } from '@components/item/navigation/NavigationItem';

export interface IDesktop extends IHeader {
  logo: ReactNode;
  menu: INavigationItem[];
}

const Desktop: React.FC<IDesktop> = (props: IDesktop) => {
  return (
    <>
      <div className="left">
        {props.logo}
        {props.menu.map((item) => {
          return (
            <div key={item.key} className="font-size-5vh">
              <NavigationItem {...item} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Desktop;
