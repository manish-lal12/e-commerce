import React, { useEffect, useState } from "react";
import { Navbar } from "../components/index";
import { useGlobalContext } from "../ThemeContext";
import { useNavigate } from "react-router-dom";
import { AdminPanel } from "../components/index";

const Login = () => {
  const navigate = useNavigate();
  const { baseUrl } = useGlobalContext();

  const [userLoginDetails, setUserLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [modal, setModal] = useState({ show: false, msg: "" });
  const [message, setMessage] = useState({ type: "", msg: "" });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userLoginDetails.email || !userLoginDetails.password) {
      setMessage({ type: "error", msg: "Please fill in all the details" });
    }
    const login = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userLoginDetails),
      credentials: "include",
    });
    const response = await login.json();
    console.log(response); // remove

    // check for credentials
    if (!response.user && login.status === 401) {
      setMessage({ type: "error", msg: "Incorrect Password" });
    } else if (!response.user && login.status === 400) {
      setMessage({
        type: "error",
        msg: "Invalid credential, please register user and try again",
      });
    } else if (response.user && login.status === 200) {
      setMessage({ type: "success", msg: "Login Success!!" });
    }
    // check user role
    if (response.user && response.user.role === "admin") {
      setModal({
        show: true,
        msg: "Aye Aye Admin 🫡!!",
      });
      navigate("/admin");
      window.location.reload();
    } else if (response.user && response.user.role === "user") {
      setModal({
        show: true,
        msg: `Welcome ${response.user.name}`,
      });
      navigate("/");
      window.location.reload();
    }
  };
  useEffect(() => {
    // only re-render when message state contains msg (donot re-render for empty values)
    if (message.msg) {
      const timer = setTimeout(() => {
        setMessage({ type: "", msg: "" });
        setModal({ show: false, msg: "" });
        window.location.reload();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <Navbar />
      {modal.show && (
        <div className="absolute mx-20 mt-28 h-52 bg-blue-600">
          <button
            className="ml-96 mt-2 px-3 py-1 bg-red-500 text-center rounded-full text-white"
            onClick={() => setModal({ show: false, msg: "" })}
          >
            X
          </button>
          <h1 className="p-14 ml-16 text-2xl text-white font-mono rounded-md">
            {modal.msg}
          </h1>
        </div>
      )}
      <div className="mt-20 flex flex-col items-center mb-4">
        <form className="w-[350px] ml-2 sm:w-[400px] h-[500px] flex flex-col items-center bg-blue-200 border border-black rounded-md">
          <h1 className="text-3xl my-5 sm:my-8 sm:text-4xl text-[#C7253E]">
            Login
          </h1>
          <div className="flex flex-col my-3">
            <label htmlFor="email" className="ml-4 mt-3">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter a valid email"
              name="email"
              className="border-b-[#4491e9] border-2 h-11 w-full my-2 placeholder:font-serif p-2"
              value={userLoginDetails.email}
              onChange={(e) =>
                setUserLoginDetails({
                  ...userLoginDetails,
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
              type="password"
              placeholder="Enter your password"
              name="password"
              className="border-2 border-b-[#4491e9] h-11 w-full my-2 placeholder:font-serif p-2"
              value={userLoginDetails.password}
              onChange={(e) =>
                setUserLoginDetails({
                  ...userLoginDetails,
                  password: e.target.value,
                })
              }
            />
          </div>
          <button
            className="w-28 p-2 bg-blue-500 sm:mx-24 rounded-sm mt-1 mb-6"
            onClick={(e) => handleLogin(e)}
          >
            Login
          </button>
          <p className="sm:ml-6">
            Don't have an account yet?{" "}
            <a href="/signup" className="text-blue-600">
              Create one
            </a>
          </p>
          {/* login status */}
          <div>
            <p
              className={
                message.type === "success"
                  ? `mt-2 text-green-600 p-2`
                  : `mt-2 text-red-700 p-2`
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

export default Login;
