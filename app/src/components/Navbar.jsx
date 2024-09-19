import Logo from "../assets/logo.png";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import { TiThMenu } from "react-icons/ti";
import { CiLogin } from "react-icons/ci";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../ThemeContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { user, loading, baseUrl } = useGlobalContext();

  const navigate = useNavigate();
  const [isMenubarOpen, setIsMenuBarOpen] = useState(false);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleMenu = () => {
    setIsMenuBarOpen(!isMenubarOpen);
  };

  const handleGetProfile = (e) => {
    e.preventDefault();
    setOpenProfileModal(!openProfileModal);
  };
  const handleLogout = async (e) => {
    await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    navigate("/");
    window.location.reload();
    setOpenProfileModal(false);
  };
  // if (loading) {
  //   return <div>Loading...</div>;
  // } else {
  //   console.log(user);
  // }

  // every time modal opens or closes it re-renders navbar
  return (
    <>
      <nav className="h-44 sm:h-32 bg-[#295F98] max-w-full grid grid-rows-6 sm:grid-cols-12 sm:w-full">
        {/* Mobile view */}
        <div className="row-span-4 sm:h-28 flex place-content-between sm:col-span-1">
          <Link to="/">
            <img
              src={Logo}
              alt={"shopify"}
              className="h-28 p-4 sm:h-26 sm:mt-1 md:h-32 sm:p-2 md:p-6 sm:ml-2 md:ml-2 shrink-0"
            />
          </Link>
          <Link to="/login" className="flex items-end">
            <img
              src={
                user
                  ? user.image
                  : "https://cdn.pixabay.com/photo/2022/06/05/07/04/person-7243410_1280.png"
              }
              alt=""
              className="h-16 w-16 sm:h-20 sm:w-36 rounded-full mt-1 mr-2 shrink-0 sm:hidden block cursor-pointer"
            />
          </Link>
        </div>
        <div className="row-span-2 flex place-content-around h-12 sm:h-16 bg-[#295F98] w-full items-center sm:col-span-11 sm:mt-12">
          <TiThMenu
            className={`text-3xl transform-gpu duration-300 ${
              isMenubarOpen ? "rotate-90" : ""
            } text-white block w-fit shrink-0 ml-1 mt-2 mr-1 cursor-pointer sm:hidden`}
            onClick={handleMenu}
          />
          {/* For larger screens */}
          <div className="flex sm:mx-10 sm:ml-48 w-fit sm:w-full">
            <input
              type="search"
              placeholder="Search products"
              className="rounded-sm h-10 sm:mx-1 sm:w-full w-fit placeholder:p-3 placeholder:text-end mt-2 shrink-0"
            />
            <button>
              <FaSearch className="h-10 w-8 bg-yellow-500 p-2 rounded-sm mt-2 ml-1" />
            </button>
          </div>
          <ul className="sm:w-fit sm:flex hidden sm:mx-14">
            <li className="sm:mx-10">
              {/* <Link to="/" className="text-white">
                Products
              </Link> */}
              <Link to="/myOrders" className="text-white">
                Orders
              </Link>
            </li>
            <li className="sm:mx-10">
              <Link to="/contact" className="text-white">
                Contact
              </Link>
            </li>
          </ul>
          <Link to="/cart">
            <MdOutlineShoppingCart className="text-4xl mt-1 w-10 shrink-0 ml-3 sm:mx-2 md:mx-8 cursor-pointer" />
          </Link>
          <div className="text-center md:mr-20 sm:mx-10">
            {/* Check if login then access profile */}
            {user ? (
              <div>
                <img
                  src={
                    user.image ||
                    "https://cdn.pixabay.com/photo/2022/06/05/07/04/person-7243410_1280.png"
                  }
                  alt=""
                  className="h-[62px] w-36 rounded-full mt-1 shrink-0 hidden sm:block cursor-pointer"
                  onClick={(e) => handleGetProfile(e)}
                />
                <p
                  className={
                    openProfileModal
                      ? "hidden"
                      : "text-center text-red-400 text-sm hidden sm:block"
                  }
                >
                  {user.name}
                </p>
              </div>
            ) : (
              <Link to="/login">
                <img
                  src="https://cdn.pixabay.com/photo/2022/06/05/07/04/person-7243410_1280.png"
                  alt=""
                  className="h-12 w-36 rounded-full mt-1 shrink-0 hidden sm:block cursor-pointer"
                />
                <CiLogin className="text-2xl absolute top-24 right-4 sm:right-20 text-orange-500" />
              </Link>
            )}
            {openProfileModal && (
              <div className="flex flex-col bg-white sm:h-64 sm:w-40 absolute right-6 top-24 border border-gray-600 shadow-lg shadow-blue-400 items-center">
                <img
                  src={
                    user.image ||
                    "https://cdn.pixabay.com/photo/2022/06/05/07/04/person-7243410_1280.png"
                  }
                  alt=""
                  className="h-16 w-16 rounded-full my-4"
                />
                <p className="my-1 font-bold">{user.name}</p>
                {/* Get profile */}
                <p className="mt-2">
                  <button className="bg-red-400 px-2 py-1 rounded-md hover:bg-red-500">
                    <Link to="/profile">View Profile</Link>
                  </button>
                </p>
                {/* Logout button */}
                <button
                  onClick={(e) => handleLogout(e)}
                  className="bg-black px-3 py-1 mt-11 text-white rounded-lg"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      {isMenubarOpen && (
        <div className="absolute bg-[#295F98] h-60 w-32 border border-[#E1D7C6] shadow-xl shadow-gray-600">
          <ul className="ml-3 p-2">
            <li className="mb-1">
              <Link to="/">Products</Link>
            </li>
            <div className="w-16 border-b border-white font-extralight mb-3"></div>
            <li className="mb-2">
              <Link to="/contact">Contact</Link>
            </li>
            <div className="w-16 border-b border-white font-extralight mb-3"></div>
            <li className="mb-2">
              <Link to="#">Latest Trending</Link>
            </li>
            <div className="w-16 border-b border-white font-extralight mb-3"></div>
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
