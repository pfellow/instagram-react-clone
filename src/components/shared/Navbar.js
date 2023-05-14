import React from 'react';
import { useNavbarStyles } from '../../styles';
import { AppBar } from '@material-ui/core';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import logo from '../../images/logo.png';

function Navbar() {
  const styles = useNavbarStyles();

  return (
    <AppBar className={styles.appBar}>
      <section className={styles.section}>
        <Logo />
      </section>
    </AppBar>
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

export default Navbar;
