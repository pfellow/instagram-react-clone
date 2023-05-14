import React from 'react';
import { useFeedPageStyles } from '../styles';
import Layout from '../components/shared/Layout';
import UserCard from '../components/shared/UserCard';
import FeedSideSuggestions from '../components/feed/FeedSideSuggestions';
import { getDefaultPost } from '../data';
import FeedPost from '../components/feed/FeedPost';
import { Hidden } from '@material-ui/core';
import LoadingScreen from '../components/shared/LoadingScreen';
import { useState } from 'react';
import { LoadingLargeIcon } from '../icons';

function FeedPage() {
  const styles = useFeedPageStyles();
  const [isEndOfFeed] = useState(false);

  let loading = false;

  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <div className={styles.container}>
        <div>
          {Array.from({ length: 5 }, () => getDefaultPost()).map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </div>
        {/* {Sidebar} */}
        <Hidden smDown>
          <div className='styles sidebarContainer'>
            <div className='styles sidebarWrapper'>
              <UserCard avatarSize={50} />
              <FeedSideSuggestions />
            </div>
          </div>
        </Hidden>
        {!isEndOfFeed && <LoadingLargeIcon />}
      </div>
    </Layout>
  );
}

export default FeedPage;
