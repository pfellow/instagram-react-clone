import React from 'react';
import { useFeedPostSkeletonStyles } from '../../styles';

function FeedPostSkeleton() {
  const styles = useFeedPostSkeletonStyles();

  return (
    <div className={styles.container}>
      <div className={styles.headerSkeleton}>
        <div className={styles.avatarSkeleton}>
          <div className={styles.headerTextSkeleton}>
            <div className={styles.primaryTextSkeleton} />
            <div className={styles.secondaryTextSkeleton} />
          </div>
        </div>
      </div>
      <div className={styles.mediaSkeleton} />
    </div>
  );
}

export default FeedPostSkeleton;
