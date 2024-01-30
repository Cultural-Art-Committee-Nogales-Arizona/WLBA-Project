import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function StripePaymentForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { token, error } = await stripe.createToken(cardElement);

      if (error) {
        setError(error.message);
      } else {
        // Send the token to your server
        onSuccess(token);
      }
    } catch (error) {
      console.error(error);
      setError('Payment failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <hr />
      <CardElement />
      {error && <div>{error}</div>}
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
      <hr />
    </form>
  );
};
