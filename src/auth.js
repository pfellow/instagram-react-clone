import React, { useState, useEffect, createContext } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import defaultUserImage from './images/default-user-image.jpg';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from './graphql/mutations';

const provider = new firebase.auth.GoogleAuthProvider();

export const AuthContext = createContext();

// Find these options in your Firebase console
firebase.initializeApp({
  apiKey: 'AIzaSyAhm3_Gz1qTl54BclSarx86EzykvloXLXw',
  authDomain: 'instagram-react-c526e.firebaseapp.com',
  projectId: 'instagram-react-c526e',
  storageBucket: 'instagram-react-c526e.appspot.com',
  messagingSenderId: '519883271380',
  appId: '1:519883271380:web:3bb7a9dfdb5a30e16d5f41'
});

function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({ status: 'loading' });
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const idTokenResult = await user.getIdTokenResult();
        const hasuraClaim =
          idTokenResult.claims['https://hasura.io/jwt/claims'];

        if (hasuraClaim) {
          setAuthState({ status: 'in', user, token });
        } else {
          // Check if refresh is required.
          const metadataRef = firebase
            .database()
            .ref('metadata/' + user.uid + '/refreshTime');

          metadataRef.on('value', async (data) => {
            if (!data.exists) return;
            // Force refresh to pick up the latest custom claims changes.
            const token = await user.getIdToken(true);
            setAuthState({ status: 'in', user, token });
          });
        }
      } else {
        setAuthState({ status: 'out' });
      }
    });
  }, []);

  const signInWithGoogle = async () => {
    await firebase.auth().signInWithPopup(provider);
  };

  const signUpWithEmailAndPassword = async (formData) => {
    const data = await firebase
      .auth()
      .createUserWithEmailAndPassword(formData.email, formData.password);
    if (data.additionalUserInfo.isNewUser) {
      const variables = {
        userId: data.user.uid,
        name: formData.name,
        username: formData.username,
        email: data.user.email,
        bio: '',
        website: '',
        profileImage: defaultUserImage,
        phoneNumber: ''
      };
      await createUser({ variables });
    }
  };

  const signOut = async () => {
    setAuthState({ status: 'loading' });
    await firebase.auth().signOut();
    setAuthState({ status: 'out' });
  };

  if (authState.status === 'loading') {
    return null;
  } else {
    return (
      <AuthContext.Provider
        value={{
          authState,
          signInWithGoogle,
          signOut,
          signUpWithEmailAndPassword
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export default AuthProvider;
