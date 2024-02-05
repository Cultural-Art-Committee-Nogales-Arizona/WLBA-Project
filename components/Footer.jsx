import React from 'react';
import PageLink from './PageLink';

const Footer = () => (
  <footer className="bg-light p-3 text-center" data-testid="footer">
    <div className="logo" data-testid="footer-logo" />
    <p data-testid="footer-text">
      user authentication provided by <a href="https://auth0.com">Auth0</a>
    </p>
    <PageLink href="/contact-us" className="nav-link" testId="navbar-ssr">
      <span >Contact Us</span>
    </PageLink>
  </footer>
);

export default Footer;
