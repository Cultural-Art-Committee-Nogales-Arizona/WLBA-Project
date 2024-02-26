'use client';

import './globals.css';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { createContext, useEffect, useState } from 'react';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { CustomUserProvider } from '@components/GlobalUserContext'; // Update the path accordingly
import styles from './page.module.css'

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        <link rel="stylesheet" href="https://cdn.auth0.com/js/auth0-samples-theme/1.0/css/auth0-theme.min.css" />
      </head>
      <body>
          <CustomUserProvider>
            <UserProvider>
              <main id="app" className="d-flex flex-column h-100" data-testid="layout">
                <NavBar />
                <div className='flex-grow-1'>
                  <div className={styles.mainDiv}>{children}</div>
                </div>
                <Footer />
              </main>
            </UserProvider>
          </CustomUserProvider>
      </body>
    </html>
  );
}
