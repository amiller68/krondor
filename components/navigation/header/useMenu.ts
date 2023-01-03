import { INavigationItem } from '../../item/navigation/NavigationItem';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

const useMenu = () => {
  const router = useRouter();

  return useMemo(
    () => [
      {
        key: 'blog',
        item: 'Blog',
        href: '/blog',
        active: router.pathname.startsWith('/blog'),
        action: () => router.push('/blog'),
      } as INavigationItem,
      {
        key: 'about',
        item: 'About',
        href: '/about',
        active: router.pathname.startsWith('/about'),
        action: () => router.push('/about'),
      } as INavigationItem,
    ],
    [router]
  );
};

export default useMenu;
