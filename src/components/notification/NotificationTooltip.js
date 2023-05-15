import React from 'react';
import { useNavbarStyles } from '../../styles';
import { Typography } from '@material-ui/core';

function NotificationTooltip() {
  const styles = useNavbarStyles();

  return (
    <div className={styles.tooltipContainer}>
      <div className={styles.tooltip}>
        <span aria-label='Followers' className={styles.followers} />
        <Typography>1</Typography>
      </div>
      <div className={styles.tooltip}>
        <span aria-label='Lkes' className={styles.likes} />
        <Typography>1</Typography>
      </div>
    </div>
  );
}

export default NotificationTooltip;
