// StripeCheckoutForm.js
"use client";

import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from 'axios';

const StripeCheckoutForm = (props) => {
  var amount=props.amount
  var description=props.description
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
  e.stopPropagation(); // ✅ Prevent bubbling

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create PaymentIntent from backend
      const res = await axios.post('http://localhost:9003/stripe/create-payment-intent', {
        amount,
        description,
      });

      const clientSecret = res.data.clientSecret;

      // 2. Confirm the card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        alert(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          props.getMessage(true)

          alert("Payment successful!");
        }
      }
    } catch (err) {
      console.log("Payment failed. Try again.",err);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <CardElement className="p-3 border rounded-md" />
      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
      >
        {loading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
};

export default StripeCheckoutForm;
