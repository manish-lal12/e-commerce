import React, { useState, useEffect } from "react";
import { Navbar } from "../components";
import { useGlobalContext } from "../ThemeContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const { baseUrl } = useGlobalContext();
  const [userSignUpDetails, setUserSignUpDetails] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", msg: "" });
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (
    //   !userSignUpDetails.name ||
    //   !userSignUpDetails.email ||
    //   !userSignUpDetails.password
    // ) {
    //   setMessage({ type: "error", msg: "Please enter all the details" });
    // }
    const signup = await fetch(`${baseUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userSignUpDetails),
      credentials: "include",
    });
    const response = await signup.json();
    console.log(response); //remove

    if (response.user && signup.status === 400) {
      setMessage({
        type: "error",
        msg: "Please fill in all the details, and try again",
      });
    } else {
      setMessage({
        type: "success",
        msg: "User account created, redirecting to login page..",
      });
    }
  };
  useEffect(() => {
    if (message.msg) {
      const timer = setTimeout(() => {
        setMessage({ type: "", msg: "" });
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  return (
    <>
      <Navbar />
      <div className=" mt-20 flex flex-col items-center mb-4">
        <form className="w-[350px] ml-2 sm:w-[400px] h-[600px] flex flex-col items-center bg-blue-200 border border-black rounded-md">
          <h1 className="text-3xl my-5 sm:my-8 sm:text-4xl text-[#C7253E]">
            Create Account
          </h1>
          <div className="flex flex-col my-3">
            <label htmlFor="name" className="ml-4 mt-3">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              name="name"
              className="border-b-[#4491e9] border-2 h-11 w-full my-2 placeholder:font-serif p-2"
              value={userSignUpDetails.name}
              onChange={(e) =>
                setUserSignUpDetails({
                  ...userSignUpDetails,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col my-3">
            <label htmlFor="email" className="ml-4 mt-3">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter a valid email"
              name="email"
              className="border-b-[#4491e9] border-2 h-11 w-full my-2 placeholder:font-serif p-2"
              value={userSignUpDetails.email}
              onChange={(e) =>
                setUserSignUpDetails({
                  ...userSignUpDetails,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div className="flex flex-col my-3">
            <label htmlFor="password" className="ml-4 mt-3">
              Password
            </label>
            <input
              type="text"
              placeholder="Enter your password"
              name="password"
              className="border-2 border-b-[#4491e9] h-11 w-full my-2 placeholder:font-serif p-2"
              value={userSignUpDetails.password}
              onChange={(e) =>
                setUserSignUpDetails({
                  ...userSignUpDetails,
                  password: e.target.value,
                })
              }
            />
          </div>
          <button
            className="w-28 p-2 bg-blue-500 sm:mx-24 rounded-sm mt-1 mb-6"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
          <p className="sm:ml-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600">
              Login
            </a>
          </p>
          {/* signup status */}
          <div>
            <p
              className={
                message.type === "success"
                  ? `mt-2 text-green-600 p-2`
                  : `mt-2 red-700 p-2`
              }
            >
              {message.msg}
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
