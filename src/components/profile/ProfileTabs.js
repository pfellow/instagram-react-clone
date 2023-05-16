import React, { useState } from 'react';
import { useProfileTabsStyles } from '../../styles';
import { Divider, Hidden, Tab, Tabs, Typography } from '@material-ui/core';
import GridPost from '../shared/GridPost';
import { GridIcon, SaveIcon } from '../../icons';

function ProfileTabs({ user, isOwner }) {
  const styles = useProfileTabsStyles();
  const [value, setValue] = useState(0);

  return (
    <>
      <section className={styles.section}>
        <Hidden xsDown>
          <Divider />
        </Hidden>
        <Hidden xsDown>
          <Tabs
            value={value}
            onChange={(_, value) => setValue(value)}
            centered
            classes={{ indicator: styles.tabsIndicator }}
          >
            <Tab
              icon={<span className={styles.postsIconLarge} />}
              label='POSTS'
              classes={{
                root: styles.tabRoot,
                labelIcon: styles.tabLabelIcon,
                wrapper: styles.tabWrapper
              }}
            />
            {isOwner && (
              <Tab
                icon={<span className={styles.savedIconLarge} />}
                label='SAVED'
                classes={{
                  root: styles.tabRoot,
                  labelIcon: styles.tabLabelIcon,
                  wrapper: styles.tabWrapper
                }}
              />
            )}
          </Tabs>
        </Hidden>
        <Hidden smUp>
          <Tabs
            value={value}
            onChange={(_, value) => setValue(value)}
            centered
            className={styles.tabs}
            classes={{ indicator: styles.tabsIndicator }}
          >
            <Tab
              icon={
                <GridIcon
                  fill={value === 0 ? '#3697f0' : undefined}
                  classes={{ root: styles.tabRoot }}
                />
              }
            />
            {isOwner && (
              <Tab
                icon={
                  <SaveIcon
                    fill={value === 1 ? '#3697f0' : undefined}
                    classes={{ root: styles.tabRoot }}
                  />
                }
              />
            )}
          </Tabs>
        </Hidden>
        <Hidden smUp>{user.posts.length === 0 && <Divider />}</Hidden>
        {value === 0 && <ProfilePosts user={user} isOwner={isOwner} />}
        {value === 1 && <SavedPosts />}
      </section>
    </>
  );
}

const ProfilePosts = ({ user, isOwner }) => {
  const styles = useProfileTabsStyles();

  if (user.posts.length === 0) {
    <section className={styles.profilePostsSection}>
      <div className={styles.noContent}>
        <div className={styles.uploadPhotoIcon} />
        <Typography variant='h4'>
          {isOwner ? 'Upload a Photo' : 'No Photos'}
        </Typography>
      </div>
    </section>;
  }

  return (
    <article className={styles.article}>
      <div className={styles.postContainer}>
        {user.posts.map((post) => (
          <GridPost key={post.id} post={post} />
        ))}
      </div>
    </article>
  );
};

const SavedPosts = () => {
  const styles = useProfileTabsStyles();

  return (
    <section className={styles.savedPostsSection}>
      <div className={styles.noContent}>
        <div className={styles.savePhotoIcon} />
        <Typography variant='h4'>Save</Typography>
        <Typography align='center'>
          Save photos and videos that you want to see again. No one is notified,
          and only you can see what you've saved.
        </Typography>
      </div>
    </section>
  );
};

export default ProfileTabs;
