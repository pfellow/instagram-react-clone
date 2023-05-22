import React, { Suspense, useCallback, useContext } from 'react';
import { useFeedPageStyles } from '../styles';
import Layout from '../components/shared/Layout';
import UserCard from '../components/shared/UserCard';
import FeedSideSuggestions from '../components/feed/FeedSideSuggestions';
import FeedPostSkeleton from '../components/feed/FeedPostSkeleton';
// import FeedPost from '../components/feed/FeedPost';
import { Hidden } from '@material-ui/core';
import LoadingScreen from '../components/shared/LoadingScreen';
import { useState, useEffect } from 'react';
import { LoadingLargeIcon } from '../icons';
import { UserContext } from '../App';
import { useQuery } from '@apollo/client';
import { GET_FEED } from '../graphql/queries';
import usePageBottom from '../utils/usePageBottom';
const FeedPost = React.lazy(() => import('../components/feed/FeedPost'));

function FeedPage() {
  const styles = useFeedPageStyles();
  const { me, feedIds } = useContext(UserContext);
  const [isEndOfFeed, setEndOfFeed] = useState(false);
  const variables = {
    feedIds,
    limit: 2,
    lastTimestamp: '2100-01-01T00:00:00.000001+00:00'
  };
  const { data, loading, fetchMore } = useQuery(GET_FEED, { variables });
  const isPageBottom = usePageBottom();

  const updateQueryHandler = useCallback((prev, { fetchMoreResult }) => {
    if (fetchMoreResult.posts.length === 0) {
      setEndOfFeed(true);
      return prev;
    }
    return { posts: [...prev.posts, ...fetchMoreResult.posts] };
  }, []);

  useEffect(() => {
    if (!isPageBottom || !data) return;
    const lastTimestamp = data.posts[data.posts.length - 1].created_at;
    const variables = { limit: 2, feedIds, lastTimestamp };
    fetchMore({
      variables,
      updateQuery: updateQueryHandler
    });
  }, [isPageBottom, data, fetchMore, feedIds, updateQueryHandler]);

  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <div className={styles.container}>
        <div>
          {data.posts.map((post, index) => (
            <Suspense key={post.id} fallback={<FeedPostSkeleton />}>
              <FeedPost index={index} post={post} />
            </Suspense>
          ))}
        </div>
        {/* {Sidebar} */}
        <Hidden smDown>
          <div className='styles sidebarContainer'>
            <div className='styles sidebarWrapper'>
              <UserCard avatarSize={50} user={me} />
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
