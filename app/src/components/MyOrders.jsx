import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../ThemeContext";
import Navbar from "./Navbar";

const MyOrders = () => {
  const { user, baseUrl } = useGlobalContext();
  console.log(user);

  const [userOrders, setUserOrders] = useState();

  const fetchUserOrders = async () => {
    const userOrdersResponse = await fetch(
      `${baseUrl}/cart/getCurrentUserOrder`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const userOrders = await userOrdersResponse.json();
    console.log(userOrdersResponse.status);

    if (userOrdersResponse.status === 404) {
      setUserOrders();
    } else {
      setUserOrders(userOrders);
    }
    console.log(userOrders);
  };
  useEffect(() => {
    fetchUserOrders();
  }, []);
  return (
    <>
      <Navbar />
      <div>
        <h1 className="text-4xl font-bold mt-8 mx-12 mb-10">My Orders</h1>
        {userOrders ? (
          <section className="flex place-content-around font-bold text-xl bg-gray-400 p-3 mt-4">
            <div>Product</div>
            <div>SubTotal</div>
            <div>Tax</div>
            <div>Total</div>
            <div>Status</div>
          </section>
        ) : (
          <div className="ml-12 text-xl">No orders available...</div>
        )}

        <div>
          {userOrders &&
            userOrders.map((order, index) => {
              const {
                status,
                subTotal,
                tax,
                total,
                orderItems,
                _id: id,
              } = order;
              return (
                <div
                  key={id}
                  className="bg-gray-200 my-2 mx-1 grid grid-cols-5"
                >
                  <div className="col-span-1">
                    {orderItems.map((item, index) => {
                      return (
                        <p key={index} className="mx-40">
                          {item.name}
                        </p>
                      );
                    })}
                  </div>
                  <p className="mx-44 col-span-1">{subTotal}</p>
                  <p className="mx-[188px] col-span-1">{tax}</p>
                  <p className="mx-[152px] col-span-1">{total}</p>
                  <p
                    className={
                      status === "paid"
                        ? "text-green-500 mx-36 "
                        : "text-yellow-600 mx-36 "
                    }
                  >
                    {status}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
