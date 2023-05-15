import React from 'react';
import { useLayoutStyles } from '../../styles';
import SEO from '../shared/Seo';
import Navbar from '../shared/Navbar';

function Layout({ children, title, minimalNavbar = false, marginTop = 60 }) {
  const styles = useLayoutStyles();

  return (
    <section className={styles.section}>
      <SEO title={title} />
      <Navbar minimalNavbar={minimalNavbar} />
      <main className={styles.main} style={{ marginTop: `${marginTop}px` }}>
        <section className={styles.childrenWrapper}>
          <div className={styles.children}>{children}</div>
        </section>
      </main>
    </section>
  );
}

export default Layout;
