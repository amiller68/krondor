import Typography from '../../typography/Typography';
import { classNames } from '@lib/utilities/misc';
import React, { FC, ReactNode } from 'react';
import Link from 'next/link';

export interface INavigationItem {
  key: string;
  item: string | ReactNode;
  action?: () => void;
  items?: INavigationItem[];
  icon?: ReactNode;
  active?: boolean;
  href?: string;
}

/*
 * A simple Navigational Item Component
 */
export const NavigationItem: FC<INavigationItem> = (item: INavigationItem) => {
  const navItem = (
    <Typography
      onClick={item.action ?? undefined}
      weight={700}
      variant="sm"
      className={classNames(
        item.active ? 'text-decoration: underline' : '',
        'text-xl font-bold py-5 px-4 flex gap-3',
        'item'
      )}
    >
      {item.icon}
      {item.item}
    </Typography>
  );
  return item.href ? (
    <Link href={item.href} style={{ textDecoration: 'none' }}>
      {navItem}
    </Link>
  ) : (
    navItem
  );
};
