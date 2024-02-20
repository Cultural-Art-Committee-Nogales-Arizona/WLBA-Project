'use client';

import { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Loading from '@components/overlays/Loading';
import ErrorMessage from '@components/overlays/ErrorMessage';
import Highlight from '@/components/Highlight';
import EmailForm from '@/components/forms/EmailForm'

import CustomUserContext from '@components/GlobalUserContext'; 

import styles from './page.module.css';

function Profile() {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const { user, isLoading } = useUser();


  return (
    <div className={styles.container}>
      {isLoading && <Loading />}
      {/* Temporary link */}
      {globalUserData ? <h1>{globalUserData.username}</h1> : null}
      {user && (
        <div>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
            decode="async"
            data-testid="profile-picture"
          />
          <p className="lead" data-testid="profile-email">
            {user.email}
          </p>
          { globalUserData.adminAuthId ? <h3>Signed in as Admin</h3> : <h3>Not signed in as admin</h3> }
        </div>
      )}
    </div>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
