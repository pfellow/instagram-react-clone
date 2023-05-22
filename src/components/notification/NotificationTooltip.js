import React from 'react';
import { useNavbarStyles } from '../../styles';
import { Typography } from '@material-ui/core';

function NotificationTooltip({ notifications }) {
  const styles = useNavbarStyles();
  const countNotifications = (notificationType) => {
    return notifications.filter(
      (notification) => notification.type === notificationType
    ).length;
  };

  const followCount = countNotifications('follow');
  const likeCount = countNotifications('like');

  console.log(notifications, followCount, likeCount);

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
