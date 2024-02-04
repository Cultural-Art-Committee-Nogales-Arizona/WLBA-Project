// !  DON'T TOUCH THIS, ITS BY NEXT.JS FOR DEVELOPMENT
import React from 'react';
import { Alert } from 'reactstrap';

const ErrorMessage = ({ children }) => (
  <Alert color="danger" fade={false} data-testid="error">
    {children}
  </Alert>
);

export default ErrorMessage;
