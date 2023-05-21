import React, { useEffect, useContext, createContext } from 'react';
import {
  Switch,
  Route,
  useHistory,
  useLocation,
  Redirect
} from 'react-router-dom';
import FeedPage from './pages/feed';
import ExplorePage from './pages/explore';
import ProfilePage from './pages/profile';
import PostPage from './pages/post';
import EditProfilePage from './pages/edit-profile';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import NotFoundPage from './pages/not-found';
import PostModal from './components/post/PostModal';
import { useRef } from 'react';
import { AuthContext } from './auth';
import { useSubscription } from '@apollo/client';
import { ME } from './graphql/subscriptions';
import LoadingScreen from './components/shared/LoadingScreen';

export const UserContext = createContext();

function App() {
  const { authState } = useContext(AuthContext);
  const isAuth = authState.status === 'in';
  const userId = isAuth ? authState.user.uid : null;
  const variables = { userId };
  const { data, loading } = useSubscription(ME, { variables });
  const history = useHistory();
  const location = useLocation();
  const prevLocation = useRef(location);
  const modal = location.state?.modal;

  useEffect(() => {
    if (history.action !== 'POP' && !modal) {
      prevLocation.current = location;
    }
  }, [location, modal, history.action]);

  if (loading) return <LoadingScreen />;
  const isModalOpen = modal && prevLocation.current !== location;

  if (!isAuth) {
    return (
      <Switch location={isModalOpen ? prevLocation.current : location}>
        <Route path='/accounts/login' component={LoginPage} />
        <Route path='/accounts/emailsignup' component={SignUpPage} />
        <Redirect to='/accounts/login' />
      </Switch>
    );
  }

  const me = isAuth && data ? data.users[0] : null;
  const currentUserId = me?.id || null;
  console.log('SOLVE THIS!!');
  const followingIds = me?.following.map(({ user }) => user.id);
  const followerIds = me?.followers.map(({ user }) => user.id);
  const feedIds = [...followingIds, currentUserId];

  return (
    <UserContext.Provider
      value={{ me, currentUserId, followerIds, followingIds, feedIds }}
    >
      <Switch location={isModalOpen ? prevLocation.current : location}>
        <Route exact path='/' component={FeedPage} />
        <Route path='/explore' component={ExplorePage} />
        <Route exact path='/:username' component={ProfilePage} />
        <Route exact path='/p/:postId' component={PostPage} />
        <Route path='/accounts/edit' component={EditProfilePage} />
        <Route path='*' component={NotFoundPage} />
      </Switch>
      {isModalOpen && <Route exact path='/p/:postId' component={PostModal} />}
    </UserContext.Provider>
  );
}

export default App;
