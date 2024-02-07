import React from 'react';
import PageLink from './PageLink';
import styles from './Footer.module.css'

const Footer = () => (
  <footer className={styles.footer} data-testid="footer">
    <h2>Cultural Arts</h2>
    <div className={styles.navLinks}>
      <p>Home</p>
      <p>About Us</p>
      <p>Gallery</p>
      <p>Events</p>
    </div>
    <div className={styles.navLinks}>
      <p>Facebook</p>
      <p>|</p>
      <PageLink href="/contact-us" className={styles.link} testId="navbar-ssr">
      <span >Contact Us</span>
      </PageLink>
      <p>|</p>
      <p>Volunteer</p>
    </div>
    <div className={styles.copyright}>
      <p>Nogales, Arizona 85621</p>
      <p>©Cultural Arts Committee of Nogales Arizona </p>
    </div>
    
  </footer>
);

export default Footer;
