import React from 'react';
import { useLoadingScreenStyles } from '../../styles';
import { LogoLoadingIcon } from '../../icons';

function LoadingScreen() {
  const styles = useLoadingScreenStyles();

  return (
    <section className={styles.section}>
      <span>
        <LogoLoadingIcon />
      </span>
    </section>
  );
}

export default LoadingScreen;
