import React from "react";

const TransactionSuccess = () => {
  return (
    <div className="flex flex-col justify-center mt-19">
      <h1 className="text-4xl text-green-600">Transaction success..</h1>
      <p>
        Redirecting to home page...{" "}
        <a href="/">Click here to go back to home page</a>{" "}
      </p>
    </div>
  );
};

export default TransactionSuccess;
