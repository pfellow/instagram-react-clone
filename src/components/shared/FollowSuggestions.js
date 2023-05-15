import React from 'react';
import { useFollowSuggestionsStyles } from '../../styles';
import { Avatar, Typography } from '@material-ui/core';
import { LoadingLargeIcon } from '../../icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getDefaultUser } from '../../data';
import { Link } from 'react-router-dom';
import FollowButton from './FollowButton';

function FollowSuggestions({ hideHeader }) {
  const styles = useFollowSuggestionsStyles();
  let loading = false;

  return (
    <div className={styles.container}>
      {!hideHeader && (
        <Typography
          color='textSecondary'
          variant='subtitle2'
          className={styles.typography}
        >
          Suggestions For You
        </Typography>
      )}
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <Slider
          className={styles.slide}
          dots={false}
          infinite
          speed={1000}
          touchThreshold={1000}
          variableWidth
          swipeToSlide
          arrows
          slidesToScroll={3}
          easing='ease-in-out'
        >
          {Array.from({ length: 10 }, () => getDefaultUser()).map((user) => (
            <FollowSuggestionsItem key={user.id} user={user} />
          ))}
        </Slider>
      )}
    </div>
  );
}

const FollowSuggestionsItem = ({ user }) => {
  const styles = useFollowSuggestionsStyles();
  const { profile_image, username, name } = user;

  return (
    <div>
      <div className={styles.card}>
        <Link to={`/${username}`}>
          <Avatar
            src={profile_image}
            alt={`${username}'s profile`}
            classes={{
              root: styles.avatar,
              img: styles.avatarImg
            }}
          />
        </Link>
        <Link to={`/${username}`}>
          <Typography
            variant='subtitle2'
            className={styles.text}
            align='center'
          >
            {username}
          </Typography>
        </Link>
        <Typography
          color='textSecondary'
          variant='body2'
          className={styles.text}
          align='center'
        >
          {name}
        </Typography>
        <FollowButton side={false} />
      </div>
    </div>
  );
};

export default FollowSuggestions;
