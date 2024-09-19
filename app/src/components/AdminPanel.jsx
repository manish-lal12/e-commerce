import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../ThemeContext";

const AdminPanel = () => {
  return (
    <>
      <Navbar />
      <h1 className="text-5xl font-bold text-pink-700 my-8 mx-8">
        Admin Control Panel
      </h1>
      <div className="flex place-content-around mt-40">
        <Link to="/adminPr">
          <div className="h-52 w-96 bg-gray-600 rounded-md text-center place-content-center text-white text-2xl hover:cursor-pointer">
            Create Products
          </div>
        </Link>

        <Link to="/adminUs">
          <div className="h-52 w-96 bg-gray-600 rounded-md text-center place-content-center text-white text-2xl hover:cursor-pointer">
            Manage Users
          </div>
        </Link>

        <Link to="/adminRv">
          <div className="h-52 w-96 bg-gray-600 rounded-md text-center place-content-center text-white text-2xl hover:cursor-pointer">
            Manage Reviews
          </div>
        </Link>
      </div>
    </>
  );
};

export default AdminPanel;
