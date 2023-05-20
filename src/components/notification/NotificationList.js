import React from 'react';
import { useNotificationListStyles } from '../../styles';
import { Avatar, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import FollowButton from '../shared/FollowButton';
import { useRef, useEffect } from 'react';
import useOutsideClick from '@rooks/use-outside-click';
import { useMutation } from '@apollo/client';
import { CHECK_NOTIFICATIONS } from '../../graphql/mutations';
import { formatDateToNowShort } from '../../utils/formatDate';

function NotificationList({ hideListHandler, notifications, currentUserId }) {
  const listContainerRef = useRef();
  const styles = useNotificationListStyles();
  useOutsideClick(listContainerRef, hideListHandler);
  const [checkNotifications] = useMutation(CHECK_NOTIFICATIONS);

  useEffect(() => {
    const variables = {
      userId: currentUserId,
      lastChecked: new Date().toISOString()
    };
    checkNotifications({ variables });
  }, [currentUserId, checkNotifications]);

  return (
    <Grid className={styles.listContainer} ref={listContainerRef} container>
      {notifications.map((notification) => {
        const isLike = notification.type === 'like';
        const isFollow = notification.type === 'follow';

        return (
          <Grid item key={notification.id} className={styles.listItem}>
            <div className={styles.listItemWrapper}>
              <div className={styles.avatarWrapper}>
                <Avatar
                  src={notification.user.profile_image}
                  alt='User avatar'
                />
              </div>
              <div className={styles.nameWrapper}>
                <Link to={`/${notification.user.username}`}>
                  <Typography variant='body1'>
                    {notification.user.username}
                  </Typography>
                </Link>
                <Typography
                  variant='body2'
                  color='textSecondary'
                  className={styles.typography}
                >
                  {isLike &&
                    `likes your photo. ${formatDateToNowShort(
                      notification.created_at
                    )}`}
                  {isFollow &&
                    `started following you. ${formatDateToNowShort(
                      notification.created_at
                    )}`}
                </Typography>
              </div>
            </div>
            <div>
              {isLike && (
                <Link to={`/p/${notification.post.id}`}>
                  <Avatar src={notification.post.media} alt='post cover' />
                </Link>
              )}
              {isFollow && <FollowButton id={notification.user.id} />}
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default NotificationList;
