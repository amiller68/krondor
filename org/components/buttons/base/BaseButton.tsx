import * as React from 'react';
import styles from './BaseButton.module.scss';
import Spinner from '../../spinners/Spinner';

export interface IBaseButton extends React.ComponentPropsWithoutRef<'button'> {
  onClick?: any;
  style?: any;
  className?: string;
  loading?: boolean;
}

const BaseButton: React.FC<IBaseButton> = (props: IBaseButton) => {
  if (props.loading) {
    return (
      <div>
        <button
          className={`${styles.button} ${styles.loading} ${props.className}`}
          style={props.style}
        >
          <Spinner style={{ borderTop: `2px solid var(--main-primary)` }} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        style={props.style}
        className={styles.button}
        onClick={props.onClick}
      >
        {props.children}
      </button>
    </div>
  );
};

export default BaseButton;
