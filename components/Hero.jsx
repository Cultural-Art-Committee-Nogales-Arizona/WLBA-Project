import React from 'react';

import Logo from '@/public/Logo';

const Hero = () => (
  <div className="hero my-5 text-center" data-testid="hero">
    <Logo scale="340" testId="hero-logo" />
    <h1 className="mb-4" data-testid="hero-title">
      Cultural Art Committee of Nogales Arizona
    </h1>

    <p className="lead" data-testid="hero-lead">
      This is a test application that demonstrates an authentication flow for a Regular Web App, using{' '}
      <a href="https://nextjs.org">Next.js</a>
    </p>
  </div>
);

export default Hero;
