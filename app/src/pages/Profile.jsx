import React, { useState, useEffect } from "react";
import { useGlobalContext } from "../ThemeContext";
import { Navbar } from "../components";
import { IoAddCircleOutline } from "react-icons/io5";

const Profile = () => {
  const { user, baseUrl } = useGlobalContext();
  const [image, setImage] = useState();
  const [isAddButtonClicked, setIsAddButtonClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", msg: "" });

  const uploadProfileImage = async (e) => {
    e.preventDefault();
    try {
      if (image) {
        // creating the form data for image
        const formData = new FormData();
        formData.append("image", image);
        // formData.append("imageName", image.name);
        setLoading(true);
        await fetch(`${baseUrl}/user/uploadProfileImage`, {
          method: "POST",
          body: formData,
          credentials: "include",
        })
          .then((response) => {
            console.log(response);
            setLoading(false);
            setMessage({ type: "success", msg: "Image uploaded" });
            setInterval(() => {
              window.location.reload();
            }, 1000);
          })
          .catch((error) => console.log(error));
      } else {
        setMessage({ type: "error", msg: "Image not uploaded" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage({ type: "", msg: "" });
    }, 6000);
    return () => clearTimeout(timer);
  });

  return (
    <>
      <Navbar />
      <h1 className="sm:text-4xl mt-12 mx-9 font-semibold">Profile Details</h1>
      <div className="flex flex-col text-2xl mx-14 mt-24">
        {/* Image container */}
        <div className="flex items-start">
          <img
            src={
              user
                ? user.image
                : "https://cdn.pixabay.com/photo/2022/06/05/07/04/person-7243410_1280.png"
            }
            alt=""
            className="h-40 w-40 rounded-full ml-8"
          />
          <IoAddCircleOutline
            className="text-5xl absolute left-[228px] text-blue-600 cursor-pointer"
            onClick={() => setIsAddButtonClicked(!isAddButtonClicked)}
          />
        </div>
        <p className="mt-16 mb-6">
          Name:
          <span className="font-bold mx-2">{user ? user.name : ""}</span>
        </p>
        <p className="my-6">
          Email:
          <span className="font-bold mx-2">{user ? user.email : ""}</span>
        </p>
        <p className="my-6">
          Role:
          <span className="font-bold mx-2">{user ? user.role : ""}</span>
        </p>
        <div className="my-4">
          <button className="text-xl bg-blue-600 p-2 rounded-md">
            Update Password
          </button>
        </div>
      </div>
      {/* Loading tab */}
      {loading && <div className="loader"></div>}
      {/* Form to upload image */}
      {isAddButtonClicked && (
        <form className="flex flex-col items-start absolute right-80 top-96 border border-black p-4 bg-gray-300 rounded-sm">
          <label htmlFor="image" className="mb-4 font-bold">
            Upload an image
          </label>
          <input
            type="file"
            placeholder="Place your file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <button
            className="bg-black px-2 py-1 text-white mx-3 mt-4 rounded-sm"
            onClick={(e) => uploadProfileImage(e)}
          >
            Upload
          </button>
          {message && (
            <p
              className={
                message.type === "success"
                  ? "text-green-400 mt-3"
                  : "text-red-600 mt-3"
              }
            >
              {message.msg}
            </p>
          )}
        </form>
      )}
    </>
  );
};

export default Profile;
