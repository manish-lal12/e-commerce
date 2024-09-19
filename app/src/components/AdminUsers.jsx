import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useGlobalContext } from "../ThemeContext";

const AdminUsers = () => {
  const { baseUrl } = useGlobalContext();
  const [data, setData] = useState();
  const [currentUser, setCurrentUser] = useState({
    image: null,
    name: "",
    email: "",
    password: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", msg: "" });

  const fetchUsers = async () => {
    const userResponse = await fetch(`${baseUrl}/user`, {
      credentials: "include",
    });
    const users = await userResponse.json();
    setData(users);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, email, password, image } = currentUser;
      console.log(name, email, password, image);
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }
      formData.append("name", name);
      formData.append("password", password);
      formData.append("email", email);

      const userSubmitResponse = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        body: formData,
      });
      if (userSubmitResponse.status === 201) {
        setMessage({ type: "success", msg: "User added" });
        window.location.reload();
      } else if (userSubmitResponse.status === 400) {
        setMessage({ type: "error", msg: "Email already registered" });
      } else {
        setMessage({ type: "error", msg: "Please fill in all details" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleUserEdit = async (e) => {
    e.preventDefault();
    const { id, name, email } = currentUser;
    const editResponse = await fetch(`${baseUrl}/user/updateUser/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, email }),
      credentials: "include",
    });
    if (editResponse.status === 200) {
      setMessage({ type: "success", msg: "Updated" });
      window.location.reload();
      ("");
    } else {
      setMessage({ type: "error", msg: "Please fill in all details" });
    }

    // don't pass image in request
  };
  const handleUserDelete = async (id) => {
    await fetch(`${baseUrl}/user/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    window.location.reload();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="text-4xl font-bold ml-16 my-12">Admin Users Panel</div>
      <form
        className="h-92 w-80 ml-20 bg-gray-300 rounded-md p-5"
        onSubmit={(e) => {
          isEditing ? handleUserEdit(e) : handleUserSubmit(e);
        }}
      >
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            placeholder="User name"
            name="name"
            className="border-b-[#4491e9] border-2 h-11 w-fit my-2 mx-1 placeholder:font-serif p-2"
            value={currentUser.name}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, name: e.currentTarget.value })
            }
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="Enter email"
            name="email"
            className="border-b-[#4491e9] border-2 h-11 w-fit my-2 mx-1 placeholder:font-serif p-2"
            value={currentUser.email}
            onChange={(e) =>
              setCurrentUser({ ...currentUser, email: e.currentTarget.value })
            }
          />
        </div>
        <div className={isEditing ? "hidden" : "flex flex-col "}>
          <label htmlFor="password">Password</label>
          <input
            type="text"
            placeholder="Enter password"
            name="password"
            className="border-b-[#4491e9] border-2 h-11 w-fit my-2 mx-1 placeholder:font-serif p-2"
            value={currentUser.password}
            onChange={(e) =>
              setCurrentUser({
                ...currentUser,
                password: e.currentTarget.value,
              })
            }
          />
        </div>
        <div className="my-1">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            className="my-2"
            onChange={(e) =>
              setCurrentUser({
                ...currentUser,
                image: e.currentTarget.files[0],
              })
            }
          />
        </div>
        <button
          className="w-full p-2 bg-black text-white rounded-md mt-4"
          type="submit"
        >
          {isEditing ? "Edit" : "Add User"}
        </button>
      </form>
      {data && (
        <div className="mx-10 mt-12 text-xl">
          <h1 className="text-3xl font-semibold">Users</h1>
          {data.users.map((user) => {
            const { name, email, image, role, _id: id } = user;
            return (
              <div
                key={id}
                className="flex place-content-between bg-gray-200 my-4 rounded-sm px-4 py-3 hover:bg-gray-300 hover:cursor-pointer"
              >
                <div className="my-4">
                  <p className="font-bold">
                    Name: <span className="font-normal">{name} </span>
                  </p>
                  <p className="font-bold">
                    Email: <span className="font-normal">{email} </span>
                  </p>
                  <p className="font-bold">
                    Image: <span className="font-normal">{image} </span>
                  </p>
                  <p className="font-bold">
                    Role: <span className="font-normal">{role} </span>
                  </p>
                </div>
                {/* Button container */}
                <div className="flex mt-8">
                  <FaEdit
                    className="mx-6 text-2xl hover:cursor-pointer"
                    onClick={() => {
                      setIsEditing(true);
                      setCurrentUser({
                        ...currentUser,
                        id,
                        name,
                        email,
                      });
                    }}
                  />
                  <MdDelete
                    className="mx-6 text-2xl hover:cursor-pointer"
                    onClick={() => handleUserDelete(id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default AdminUsers;
