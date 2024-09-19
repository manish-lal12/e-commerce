import React, { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "../ThemeContext";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

//This page component is wrapped by Elements provider of Stripe in App.js, which facilitates to use different components of stripe

const Payment = () => {
  const { order, baseUrl } = useGlobalContext();
  console.log(order);

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState();
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (stripe && elements) {
      setIsPaymentReady(true);
    }
  }, [stripe, elements]);

  const onConfirm = async (e) => {
    e.preventDefault();

    // if stripe.js is not loaded yet
    if (!stripe || !email) {
      // disable form submission
      setErrorMessage("Please fill out email and try again");
      return;
    }

    //Create payment intent and obtain clientSecret
    //check route
    // pass body [orderId]
    const response = await fetch(`${baseUrl}/cart/create-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
      credentials: "include",
    });
    const { client_secret: clientSecret } = await response.json();

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message);
      return;
    }

    // Confirm the paymentIntent using the details collected by the Express Checkout Element
    const { error } = await stripe.confirmPayment({
      // `elements` instance used to create the Express Checkout Element
      elements,
      // `clientSecret` from the created PaymentIntent
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/paymentSuccess`,
        payment_method_data: {
          billing_details: {
            email: email,
          },
        },
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    }
  };
  // options for payment Element
  const options = {
    layout: {
      type: "tabs",
      defaultCollapsed: false,
    },
  };

  return (
    <>
      <main className="bg-gray-200">
        <h1 className="text-4xl p-8 font-extrabold">Payments Details</h1>
        <div
          id="checkout-page"
          className="flex justify-center mt-24 w-full min-h-screen"
        >
          {isPaymentReady ? (
            <>
              <form className="pb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <PaymentElement options={options} />
                {errorMessage && <div>{errorMessage}</div>}
                <button
                  onClick={(e) => onConfirm(e)}
                  disabled={!stripe || !elements}
                  className="bg-black text-white p-3 w-full mt-4 text-center rounded-md"
                >
                  Pay Now
                </button>
              </form>
            </>
          ) : (
            <p>Loading payment methods..</p>
          )}
        </div>
      </main>
    </>
  );
};

export default Payment;
