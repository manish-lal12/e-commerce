import React, { useState, useEffect } from "react";
import { Navbar } from "../components/index";
import { useGlobalContext } from "../ThemeContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, baseUrl, order, setOrder } = useGlobalContext();

  const [isOrderPlaced, setisOrderPlaced] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(true);

  // create order
  // make payment using orderId
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify(cart));

    const createOrderResponse = await fetch(`${baseUrl}/cart/createOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
      credentials: "include",
    });
    const response = await createOrderResponse.json();
    console.log(response);
    // If user is not signed in
    if (createOrderResponse.status === 401) {
      setIsUserSignedIn(false);
    }
    // If user is signed in
    else {
      setOrder({
        subTotal: response.order.subTotal,
        tax: response.order.tax,
        total: response.order.total,
        orderId: response.order._id,
      });
      setisOrderPlaced(true);
    }
  };
  useEffect(() => {
    if (isOrderPlaced) {
      navigate("/paymentConfirmation");
    }
    const timer = setTimeout(() => {
      setIsUserSignedIn(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isUserSignedIn, isOrderPlaced]);
  return (
    <>
      <Navbar />
      {cart.items.length < 1 ? (
        <div className="mt-10 mx-10">
          <div className="text-4xl my-4">No items in the cart</div>
          <p className="text-xl">Please add products to buy</p>
        </div>
      ) : (
        <div className="flex flex-col items-center sm:mt-10 ">
          <form className="flex flex-col border border-black mt-10 rounded-sm pb-4 mb-10">
            <h1 className=" text-2xl sm:text-3xl mb-4 text-[#e4debd] bg-blue-400 p-2">
              Shopping Cart
            </h1>
            <div className="flex flex-col font-serif mt-4">
              {cart.items.map((item, index) => {
                const { name, product: productId, price, image, amount } = item;
                return (
                  <div
                    key={productId}
                    className="flex mt-3 mb-6 place-content-between"
                  >
                    <div className="flex">
                      <img
                        src={image}
                        alt={name}
                        className="w-32 h-28 sm:h-36 sm:w-48 sm:p-3 border-gray-200 border-2 mx-2"
                      />
                      <div>
                        <p className="text-xl mr-10 h mt-5 sm:my-5 sm:mr-16 sm:text-2xl">
                          {name}
                        </p>
                        <p className="sm:text-xl font-light">
                          Quantity:{" "}
                          <span className="font-extrabold sm:text-xl">
                            {amount}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="sm:my-5 mr-3 mt-5 sm:ml-24 font-bold sm:text-2xl">
                      ${amount * price}
                    </p>
                  </div>
                );
              })}
            </div>
            <button
              className="bg-[#C7253E] w-28 ml-24 sm:w-36 p-3 sm:ml-48 mt-12 rounded-sm text-white text-xl"
              onClick={(e) => handlePlaceOrder(e)}
            >
              Place Order
            </button>
          </form>
        </div>
      )}
      {!isUserSignedIn && (
        <div className="text-center text-xl">Please signIn to Place Order</div>
      )}
    </>
  );
};

export default Cart;
