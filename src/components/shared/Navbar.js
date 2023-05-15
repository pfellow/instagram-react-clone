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
import { defaultCurrentUser, getDefaultUser } from '../../data';
import NotificationTooltip from '../notification/NotificationTooltip';
import NotificationList from '../notification/NotificationList';
import { useNProgress } from '@tanem/react-nprogress';

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
  const styles = useNavbarStyles();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setREsults] = useState('');

  const hasResults = Boolean(query) && results.length > 0;

  useEffect(() => {
    if (!query.trim()) return;
    setREsults(Array.from({ length: 5 }, () => getDefaultUser()));
  }, [query]);

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
            <Grid className={styles.resultContainer} container>
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
  const styles = useNavbarStyles();
  const [showList, setShowList] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

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

  return (
    <div className={styles.linksContainer}>
      {showList && <NotificationList hideListHandler={hideListHandler} />}
      <div className={styles.linksWrapper}>
        <Hidden xsDown>
          <AddIcon />
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

        <Link to={`/${defaultCurrentUser.username}`}>
          <div
            className={
              path === `/${defaultCurrentUser.username}`
                ? styles.profileActive
                : ''
            }
          ></div>
          <Avatar
            src={defaultCurrentUser.profile_image}
            className={styles.profileImage}
          />
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
