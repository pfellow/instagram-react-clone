import React from 'react';
import { usePostSkeletonStyles } from '../../styles';
import { useMediaQuery } from '@material-ui/core';

export function PostSkeleton() {
  const styles = usePostSkeletonStyles();
  const matches = useMediaQuery('(min-width: 900px)');

  return (
    <div
      className={styles.container}
      style={{ gridTemplateColumns: matches && '600px 335px' }}
    >
      <div className={styles.mediaSkeleton} />
      <div>
        <div className={styles.headerSkeleton}>
          <div className={styles.avatarSkeleton}>
            <div className={styles.headerTextSkeleton}>
              <div className={styles.primaryTextSkeleton} />
              <div className={styles.secondaryTextSkeleton} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostSkeleton;
