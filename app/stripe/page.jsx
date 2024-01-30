"use client"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePaymentForm from '../../components/StripePaymentForm';

const stripePromise = loadStripe('pk_test_51Oe5D9CyjAxYCedky7W2ykByYNh1Ih2DjGGoE690cFL79G88mA4YKJ5ooiNRVqEt34TtwWgJmf73e1VDxORKZGrS00VpCe7PqU');

const PaymentPage = () => {
  const handlePaymentSuccess = (token) => {
    // Send the token to your server for further processing
    console.log(token);
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <Elements stripe={stripePromise}>
        <StripePaymentForm onSuccess={handlePaymentSuccess} />
      </Elements>
    </div>
  );
};

export default PaymentPage;
