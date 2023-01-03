import styles from './PostCard.module.sass';
import Link from 'next/link';

export interface IPostCard {
  title: string;
  cid: string;
  date: string;
}

const PostCard: React.FC<IPostCard> = ({ title, cid, date }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.card__body}>
          <span className={`${styles.tag} ${styles['tag-grey']}`}>{cid}</span>
          <Link href={`/blog/${cid}`} className={styles.inlineLink}>
            <h4>{title}</h4>
          </Link>
          <p>{date}</p>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
