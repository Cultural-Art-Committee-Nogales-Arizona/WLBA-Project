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
  const { globalUserData, updateGlobalUserData } = useContext(CustomUserContext)
  const { user, isLoading } = useUser();
  console.log(globalUserData)
  return (
    <>
      {isLoading && <Loading />}
      {/* Temporary link */}
      {globalUserData ? <h1>{globalUserData.username}</h1> : null}
      <PageLink href="/dashboard/create-event" className="nav-link" testId="navbar-home">
        <span>Create Event Form</span>
      </PageLink>
      <PageLink href="/dashboard/edit-event" className="nav-link" testId="navbar-home">
        <span>Edit Event Form</span>
      </PageLink>
      <PageLink href="/dashboard/request-volunteers" className="nav-link" testId="navbar-home">
        <span>Request Volunteers Form</span>
      </PageLink>
      <PageLink href="/dashboard/accept-vendors" className="nav-link" testId="navbar-home">
        <span>Accept Vendors Form</span>
      </PageLink>
      {user && (
        <>
          <Row className="align-items-center profile-header mb-5 text-center text-md-left" data-testid="profile">
            <Col md={2}>
              <img
                src={user.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                decode="async"
                data-testid="profile-picture"
              />
            </Col>
            <Col md>
              <h2 data-testid="profile-name">{user.name}</h2>
              <p className="lead text-muted" data-testid="profile-email">
                {user.email}
              </p>
            </Col>
          </Row>
          <Row data-testid="profile-json">
            <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
          </Row>
        </>
      )}
    </>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
