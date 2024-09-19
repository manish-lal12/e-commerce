import React, { useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Cart,
  Contact,
  Product,
  SignUp,
  Payment,
  Profile,
} from "./pages/index";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import {
  AdminPanel,
  AdminProduct,
  AdminUsers,
  AdminReviews,
  RouteNotAvailable,
  PaymentConfirmation,
  PaymentSuccess,
  MyOrders,
} from "./components/index";
import ProtectedRoute from "./utils/ProtectedRoute";
// import dotenv from "dotenv";
// dotenv.config();

// Stripe Payment Integration
// it is called outside of a componen's render to avoid recreating the 'Stripe' object on every render
// creating 'Stripe' object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_P_KEY);

const App = () => {
  const options = {
    mode: "payment",
    amount: 2000,
    currency: "usd",
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myOrders" element={<MyOrders />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/paymentConfirmation" element={<PaymentConfirmation />} />
        <Route
          path="/checkout"
          element={
            <Elements stripe={stripePromise} options={options}>
              <Payment />
            </Elements>
          }
        />
        <Route path="/paymentSuccess" element={<PaymentSuccess />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminPr"
          element={
            <ProtectedRoute>
              <AdminProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminUs"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminRv"
          element={
            <ProtectedRoute>
              <AdminReviews />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<RouteNotAvailable />} />
      </Routes>
    </>
  );
};

export default App;
