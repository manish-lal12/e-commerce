import React from "react";
import { Link } from "react-router-dom";

const RouteNotAvailable = () => {
  return (
    <div className="flex-col">
      <p>Sorry, the requested URL is not available.....</p>
      <Link to="/" className="text-blue-600">
        Click here to go back to home
      </Link>
    </div>
  );
};

export default RouteNotAvailable;
