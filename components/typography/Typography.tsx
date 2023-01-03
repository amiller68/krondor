import styles from './Typography.module.scss';

import React from 'react';

export const H1 = (props: any) => {
  return <h1 className={styles.h1} {...props} />;
};

export const H2 = (props: any) => {
  return <h2 className={styles.h2} {...props} />;
};

export const H3 = (props: any) => {
  return <h3 className={styles.h3} {...props} />;
};

export const H4 = (props: any) => {
  return <h4 className={styles.h4} {...props} />;
};

export const P = (props: any) => {
  return <p className={styles.p} {...props} />;
};

export const CodeBlock = (props: any) => {
  return <p className={styles.code} {...props} />;
};

export type TypographyWeight = 400 | 500 | 700;

const WEIGHTS = {
  400: 'font-medium',
  700: 'font-bold',
};

export type TypographyVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'lg'
  | 'base'
  | 'sm'
  | 'xs'
  | 'xxs';

const VARIANTS = {
  hero: 'text-hero leading-[4rem]',
  h1: 'text-4xl leading-[46px]',
  h2: 'text-3xl tracking-[-0.02em]',
  h3: 'text-2xl leading-7 tracking-[-0.01em]',
  lg: 'text-lg leading-6',
  base: 'text-base leading-5',
  sm: 'text-sm leading-5',
  xs: 'text-xs leading-4',
  xxs: 'text-[0.625rem] leading-[1.2]',
};

export interface TypographyProps
  extends React.AllHTMLAttributes<React.ReactHTML> {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  component?: keyof React.ReactHTML;
  className?: string;
  clickable?: boolean;
}

// eslint-disable-next-line react/display-name
const Typography: React.FC<TypographyProps> = React.forwardRef(
  (
    {
      variant = 'base',
      weight = 400,
      component = 'div',
      className = 'currentColor',
      children = [],
      onClick = undefined,
      ...rest
    },
    ref
  ) => {
    return React.createElement(
      component,
      {
        className: [
          VARIANTS[variant],
          // @ts-ignore TYPE NEEDS FIXING
          WEIGHTS[weight],
          onClick ? 'cursor-pointer select-none' : '',
          className,
        ]
          .filter(Boolean)
          .join(' '),
        onClick,
        ...rest,
        ref,
      },
      children
    );
  }
);

export default Typography;
