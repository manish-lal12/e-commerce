import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../ThemeContext";
import { useNavigate, Link } from "react-router-dom";

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const { baseUrl, order, setOrder } = useGlobalContext();
  console.log(order);

  return (
    <>
      <h1 className="text-4xl font-bold mt-10 ml-14">
        Payment Confirmation Page
      </h1>
      <div className="flex flex-col items-center pb-64 justify-center h-screen">
        <form className="border-black border-2 rounded-md">
          <h1 className="text-2xl bg-blue-600 p-2 text-white border-gray-600 border-b">
            Payment Confirmation
          </h1>
          <div className="text-xl font-bold ml-6 pt-3">
            <div className="my-2">Sub Total: ${order.subTotal}</div>
            <div className="my-2">Tax: ${order.tax}</div>
            <div className="my-2">Total: ${order.total}</div>
          </div>
          <button
            className="bg-[#C7253E] w-28 sm:w-28 sm:ml-16 sm:p-2 sm:mt-4 mb-2 rounded-sm text-white sm:text-xl"
            // onClick={(e) => setIsPaymentConfirmed(true)}
          >
            <Link to="/checkout">Proceed</Link>
          </button>
        </form>
      </div>
    </>
  );
};

export default PaymentConfirmation;
