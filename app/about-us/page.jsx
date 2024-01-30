import React from 'react';
import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0';

import Highlight from '../../components/Highlight';

export default withPageAuthRequired(
  async function SSRPage() {
    const { user } = await getSession();
    return (
      <>
        <div className="mb-5" data-testid="ssr">
          <h1 data-testid="ssr-title">This is the users data</h1>
          <div data-testid="ssr-text">
            <p>
              This is the data that is sent to you when a user logs in with their account.
              You can access this data and do with it as you please.
              {/* You can protect a server-side rendered page by wrapping it with <code>withPageAuthRequired</code>. Only
              logged in users will be able to access it. If the user is logged out, they will be redirected to the login
              page instead.{' '} */}
            </p>
          </div>
        </div>
        <div className="result-block-container" data-testid="ssr-json">
          <div className="result-block">
            <h6 className="muted">User</h6>
            <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
          </div>
        </div>
      </>
    );
  },
  { returnTo: '/ssr' }
);
