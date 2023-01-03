import styles from './Tag.module.sass';

const Tag = (props: any) => {
  return (
    <span className={styles.tag} style={props.style}>
      {props.children}
    </span>
  );
};

export default Tag;
