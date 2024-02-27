import React from 'react';
import PageLink from './PageLink';
import GoogleMap from './GoogleMap'
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
      <PageLink href="https://www.google.com/maps/place/Nogales,+AZ+85621/@31.3643595,-111.0155213,12z/data=!3m1!4b1!4m6!3m5!1s0x86d6a7b602bcccef:0x55dc0a7c4ff9d977!8m2!3d31.3403775!4d-110.9342532!16zL20vMHFxdzk?entry=ttu" className={styles.link} testId="navbar-external">
        <span>Location</span>
      </PageLink>
      <PageLink href="https://buy.stripe.com/eVa6ptaH472hgkE000" className={styles.link}>
        <span>Donate</span>
      </PageLink>
    </div>
    <div className={styles.navLinks}>
      <a href="https://www.facebook.com/CulturalArtsCommitteeOfNogalesArizona/" className={styles.link} target="_blank"><p>Facebook</p></a>
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
    {/* We MIGHT implement this */}
    {/* <GoogleMap /> */}
  </footer>
);

export default Footer;
