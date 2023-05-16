import React, { Suspense } from 'react';
import { useFeedPageStyles } from '../styles';
import Layout from '../components/shared/Layout';
import UserCard from '../components/shared/UserCard';
import FeedSideSuggestions from '../components/feed/FeedSideSuggestions';
import FeedPostSkeleton from '../components/feed/FeedPostSkeleton';
import { getDefaultPost } from '../data';
// import FeedPost from '../components/feed/FeedPost';
import { Hidden } from '@material-ui/core';
import LoadingScreen from '../components/shared/LoadingScreen';
import { useState } from 'react';
import { LoadingLargeIcon } from '../icons';
const FeedPost = React.lazy(() => import('../components/feed/FeedPost'));

function FeedPage() {
  const styles = useFeedPageStyles();
  const [isEndOfFeed] = useState(false);

  let loading = false;

  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <div className={styles.container}>
        <div>
          {Array.from({ length: 5 }, () => getDefaultPost()).map(
            (post, index) => (
              <Suspense key={post.id} fallback={<FeedPostSkeleton />}>
                <FeedPost index={index} post={post} />
              </Suspense>
            )
          )}
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
