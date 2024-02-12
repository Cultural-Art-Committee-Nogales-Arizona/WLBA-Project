import React from 'react';
import PageLink from './PageLink';
import styles from './Footer.module.css'

const Footer = () => (
  <footer className={styles.footer} data-testid="footer">
    <h2>Cultural Arts</h2>
    <div className={styles.navLinks}>
      <PageLink href="/" className={styles.link} testId="navbar-home">
        <span>Home</span>
      </PageLink>
      <PageLink href="/about-us" className={styles.link} testId="navbar-ssr">
        <span>About Us</span>
      </PageLink>
      <PageLink href="/gallery" className={styles.link} testId="navbar-external">
        <span>Gallery</span>
      </PageLink>
      <p>Events</p>
    </div>
    <div className={styles.navLinks}>
      <p>Facebook</p>
      <p>|</p>
      <PageLink href="/contact-us" className={styles.link} testId="navbar-ssr">
        <span >Contact Us</span>
      </PageLink>
      <p>|</p>
      <PageLink href="/volunteer" className={styles.link} testId="navbar-external">
        <span>Volunteer</span>
      </PageLink>
    </div>
    <div className={styles.copyright}>
      <p>Nogales, Arizona 85621</p>
      <p>©Cultural Arts Committee of Nogales Arizona </p>
    </div>

  </footer>
);

export default Footer;
