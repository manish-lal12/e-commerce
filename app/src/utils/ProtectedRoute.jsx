import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../ThemeContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useGlobalContext();
  if (!user) {
    console.log("No user");
  } else if (user.role !== "admin") {
    return (
      <div className="flex flex-col my-4 mx-4">
        <h1 className="text-4xl my-4">
          {user
            ? "You don't have permission to access this page."
            : "Unauthorized to access this route."}
        </h1>
        <Link to="/" className="text-blue-600 underline">
          Go back to homepage
        </Link>
      </div>
    );
  }
  return children;
};
export default ProtectedRoute;
