import React from 'react';
import { useNavbarStyles, WhiteTooltip, RedTooltip } from '../../styles';
import {
  AppBar,
  Avatar,
  Fade,
  Grid,
  Hidden,
  InputBase,
  Typography,
  Zoom
} from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom';
import logo from '../../images/logo.png';
import { useState, useEffect } from 'react';
import {
  LoadingIcon,
  AddIcon,
  LikeIcon,
  LikeActiveIcon,
  ExploreActiveIcon,
  HomeIcon,
  HomeActiveIcon,
  ExploreIcon
} from '../../icons';
import NotificationTooltip from '../notification/NotificationTooltip';
import NotificationList from '../notification/NotificationList';
import { useNProgress } from '@tanem/react-nprogress';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_USERS } from '../../graphql/queries';
import { useContext } from 'react';
import { UserContext } from '../../App';
import { useRef } from 'react';
import AddPostDialog from '../post/AddPostDialog';

function Navbar({ minimalNavbar }) {
  const styles = useNavbarStyles();
  const [isLoadingPage, setLoadingPage] = useState(true);
  const history = useHistory();
  const path = history.location.pathname;

  useEffect(() => {
    setLoadingPage(false);
  }, [path]);

  return (
    <>
      <Progress isAnimating={isLoadingPage} />
      <AppBar className={styles.appBar}>
        <section className={styles.section}>
          <Logo />
          {!minimalNavbar && (
            <>
              <Search history={history} />
              <Links path={path} />
            </>
          )}
        </section>
      </AppBar>
    </>
  );
}

function Logo() {
  const styles = useNavbarStyles();

  return (
    <div className={styles.logoContainer}>
      <Link to='/'>
        <div className='styles logoWrapper'>
          <img src={logo} alt='Instagram' className={styles.logo} />
        </div>
      </Link>
    </div>
  );
}

function Search({ history }) {
  const [searchUsers, { data }] = useLazyQuery(SEARCH_USERS);
  const styles = useNavbarStyles();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState('');

  const hasResults = Boolean(query) && results.length > 0;

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    const variables = { query: `%${query}%` };
    searchUsers({ variables });
    if (data) {
      setResults(data.users);
    }
    setLoading(false);
  }, [query, data, searchUsers]);

  const clearInputHandler = () => {
    setQuery('');
  };

  return (
    <Hidden xsDown>
      <WhiteTooltip
        arrow
        interactive
        TransitionComponent={Fade}
        open={hasResults}
        title={
          hasResults && (
            <Grid className={styles.linksContainer} container>
              {results.map((result) => (
                <Grid
                  item
                  key={result.id}
                  className={styles.resultLink}
                  onClick={() => {
                    history.push(`/${result.username}`);
                    clearInputHandler();
                  }}
                >
                  <div className={styles.resultWrapper}>
                    <div className={styles.avatarWrapper}>
                      <Avatar src={result.profile_image} alt='user avatar' />
                    </div>
                    <div className={styles.nameWrapper}>
                      <Typography variant='body1'>{result.username}</Typography>
                      <Typography variant='body2' color='textSecondary'>
                        {result.name}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          )
        }
      >
        <InputBase
          className={styles.input}
          onChange={(e) => setQuery(e.target.value)}
          startAdornment={<span className={styles.searchIcon} />}
          endAdornment={
            loading ? (
              <LoadingIcon />
            ) : (
              <span onClick={clearInputHandler} className={styles.clearIcon} />
            )
          }
          value={query}
          placeholder='Search'
        />
      </WhiteTooltip>
    </Hidden>
  );
}

function Links({ path }) {
  const me = useContext(UserContext);
  const styles = useNavbarStyles();
  const [showList, setShowList] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [media, setMedia] = useState(null);
  const [showAddPostDialog, setAddPostDialog] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const timeout = setTimeout(hideTooltipHandler, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const toggleListHandler = () => {
    setShowList((prev) => !prev);
  };

  const hideTooltipHandler = () => {
    setShowTooltip(false);
  };

  const hideListHandler = () => {
    setShowList(false);
  };

  const openFileInput = () => {
    inputRef.current.click();
  };

  const handleAddPost = (e) => {
    setMedia(e.target.files[0]);
    setAddPostDialog(true);
  };

  const closeHandler = () => {
    setAddPostDialog(false);
  };

  return (
    <div className={styles.linksContainer}>
      {showList && <NotificationList hideListHandler={hideListHandler} />}
      <div className={styles.linksWrapper}>
        {showAddPostDialog && (
          <AddPostDialog media={media} closeHandler={closeHandler} />
        )}
        <Hidden xsDown>
          <input
            type='file'
            style={{ display: 'none' }}
            ref={inputRef}
            onChange={handleAddPost}
          />
          <AddIcon onClick={openFileInput} />
        </Hidden>
        <Link to='/'>{path === '/' ? <HomeActiveIcon /> : <HomeIcon />}</Link>
        <Link to='/explore'>
          {path === '/explore' ? <ExploreActiveIcon /> : <ExploreIcon />}
        </Link>
        <RedTooltip
          arrow
          open={showTooltip}
          onOpen={hideTooltipHandler}
          TransitionComponent={Zoom}
          title={<NotificationTooltip />}
        >
          <div className={styles.notifications} onClick={toggleListHandler}>
            {showList ? <LikeActiveIcon /> : <LikeIcon />}
          </div>
        </RedTooltip>

        <Link to={`/${me.me.username}`}>
          <div
            className={
              path === `/${me.me.username}` ? styles.profileActive : ''
            }
          ></div>
          <Avatar src={me.me.profile_image} className={styles.profileImage} />
        </Link>
      </div>
    </div>
  );
}

const Progress = ({ isAnimating }) => {
  const styles = useNavbarStyles();
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating
  });

  return (
    <div
      className={styles.progressContainer}
      style={{
        opacity: isFinished ? 0 : 1,
        transition: `${animationDuration}ms linear`
      }}
    >
      <div
        className={styles.progressBar}
        style={{
          marginLeft: `${(-1 + progress) * 100}%`,
          transition: `margin-left ${animationDuration}ms linear`
        }}
      >
        <div className={styles.progressBackground} />
      </div>
    </div>
  );
};

export default Navbar;
