import React from 'react';
import { useNavbarStyles } from '../../styles';
import { Typography } from '@material-ui/core';

function NotificationTooltip({ notifications }) {
  const styles = useNavbarStyles();

  const countNotifications = (notificationType) => {
    return notifications.reduce((counter, current) => {
      return current.type === notificationType && counter + 1;
    }, 0);
  };

  const followCount = countNotifications('follow');
  const likeCount = countNotifications('like');

  return (
    <div className={styles.tooltipContainer}>
      {followCount > 0 && (
        <div className={styles.tooltip}>
          <span aria-label='Followers' className={styles.followers} />
          <Typography>{followCount}</Typography>
        </div>
      )}
      {likeCount > 0 && (
        <div className={styles.tooltip}>
          <span aria-label='Likes' className={styles.likes} />
          <Typography>{likeCount}</Typography>
        </div>
      )}
    </div>
  );
}

export default NotificationTooltip;
