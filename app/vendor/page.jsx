'use client';

import { useContext, useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import Loading from '@components/overlays/Loading';
import ErrorMessage from '@components/overlays/ErrorMessage';
import Highlight from '@/components/Highlight';

import CustomUserContext from '@components/GlobalUserContext'; 

import PageLink from '@/components/PageLink';

function Profile() {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const { user, isLoading } = useUser();

  return (
    <>
      {isLoading && <Loading />}
      {/* Temporary link */}
      {globalUserData ? <h1>Welcome {globalUserData.username}</h1> : null}
      <h2>Vendor dashboard</h2>
      
      {user && (
        <>
          <Link href={'/vendor/register'}>Sign up</Link>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
