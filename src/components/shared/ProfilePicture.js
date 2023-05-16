import React from 'react';
import { useProfilePictureStyles } from '../../styles';
import { defaultCurrentUser } from '../../data';
import { Person } from '@material-ui/icons';

function ProfilePicture({
  size,
  image = defaultCurrentUser['profile_image'],
  isOwner
}) {
  const styles = useProfilePictureStyles({ size, isOwner });

  return (
    <section className={styles.section}>
      {image ? (
        <div className={styles.wrapper}>
          <img src={image} alt='user profile' className={styles.image} />
        </div>
      ) : (
        <div className={styles.wrapper}>
          <Person className={styles.person} />
        </div>
      )}
    </section>
  );
}

export default ProfilePicture;
