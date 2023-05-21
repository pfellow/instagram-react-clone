import React, { useContext, useRef, useState } from 'react';
import { useProfilePictureStyles } from '../../styles';
import { Person } from '@material-ui/icons';
import { useMutation } from '@apollo/client';
import handleImageUpload from '../../utils/handleImageUpload';
import { EDIT_USER_AVATAR } from '../../graphql/mutations';
import { UserContext } from '../../App';

function ProfilePicture({ size, image, isOwner }) {
  const styles = useProfilePictureStyles({ size, isOwner });
  const inputRef = useRef();
  const { currentUserId } = useContext(UserContext);
  const [img, setImg] = useState(image);
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);

  const openFileInput = () => {
    inputRef.current.click();
  };

  const handleUpdateProfilePic = async (e) => {
    const url = await handleImageUpload(e.target.files[0], 'instagram_avatar');
    const variables = { id: currentUserId, profileImage: url };
    await editUserAvatar({ variables });
    setImg(url);
  };

  return (
    <section className={styles.section}>
      <input
        type='file'
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleUpdateProfilePic}
      />
      {image ? (
        <div
          className={styles.wrapper}
          onClick={isOwner ? openFileInput : () => null}
        >
          <img src={img} alt='user profile' className={styles.image} />
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
