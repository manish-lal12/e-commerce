import React, { useEffect } from "react";
import { TiTickOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  });
  return (
    <div>
      <div className="flex mt-20 justify-center">
        <div className="text-5xl text-center mt-10 mx-4">Payment Success</div>
        <div className="bg-green-600 w-36 rounded-full py-1">
          <TiTickOutline className="text-9xl text-white" />
        </div>
      </div>
      {/* Redirecting message */}
      <div className="text-2xl mt-8 ml-8 text-blue-500">
        Redirecting to home page...
      </div>
    </div>
  );
};

export default PaymentSuccess;
