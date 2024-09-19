import React, { useEffect, useState } from "react";
import { Navbar } from "../components/index";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "../ThemeContext";

const Product = () => {
  const { baseUrl, cart, setCart } = useGlobalContext();
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [productAmount, setProductAmount] = useState(0);
  const [isProductAdded, setIsProductAdded] = useState({
    status: false,
    msg: "",
  });

  const fetchProduct = async () => {
    const response = await fetch(`${baseUrl}/product/getProduct/${id}`);
    const product = await response.json();
    setProduct(product);
  };

  const handleCart = async () => {
    setIsProductAdded({ status: true, msg: "Product added to cart" });
    setCart((prevCart) => ({
      ...prevCart,
      items: [
        ...prevCart.items,
        {
          amount: productAmount,
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
      ],
    }));
    console.log(cart);
    //handle cart request in checkout cart
    // push orders to cart
  };

  const handleIncreaseAmount = () => {
    console.log("increase");

    setProductAmount((prevAmount) => {
      let newAmount = prevAmount + 1;
      if (newAmount > 10) {
        setProductAmount(10);
      }
      return newAmount;
    });
  };
  const handleDecreaseAmount = () => {
    console.log("decrease");

    setProductAmount((prevAmount) => {
      let newAmount = prevAmount - 1;
      if (newAmount < 1) {
        setProductAmount(0);
      }
      return newAmount;
    });
  };
  useEffect(() => {
    fetchProduct();
    const timer = setTimeout(() => {
      setIsProductAdded({ status: false, msg: "" });
      if (isProductAdded.status) {
        setProductAmount(0);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isProductAdded]);

  return (
    <>
      <Navbar />
      {/* Loading functionality */}
      {product && (
        <div className="flex flex-col pt-12 sm:pt-20 sm:pl-32 bg-[#d8d6d3] h-screen">
          <div className="flex">
            <div className="w-84 ml-2 p-1 mt-4 sm:h-[450px] sm:w-[380px] bg-white sm:p-7 flex shadow-gray-800 shadow-lg rounded-sm">
              <img
                src={product.image}
                alt={product.title}
                className="h-80 w-64 my-12 sm:h-80 sm:w-80 sm:mt-8"
              />
            </div>
            {/* product info */}
            <div className="my-3 ml-4 mr-2 sm:my-12 sm:ml-32">
              <p className="my-1 sm:my-3 sm:text-xl">
                Rating:
                <span className="font-bold mx-3">
                  {product.rating} / 5
                  <span className="font-light mx-3">
                    ({product.reviews.length})
                  </span>
                </span>
              </p>
              <p className="mt-12 sm:text-xl h-16 sm:h-[154px]">
                Category:
                <span className="font-extralight capitalize mx-3 ">
                  {product.category}
                </span>
              </p>
              <p className="my-3 sm:text-xl mt-16 sm:mt-0 text-green-600">
                In Stock
              </p>
              <p className="my-3 sm:text-2xl">
                Price:
                <span className="font-bold mx-3 mb-4">${product.price}</span>
              </p>
              <button
                className={
                  productAmount > 0
                    ? "hidden"
                    : "bg-[#C7253E] sm:text-xl text-white p-4 mt-7 sm:mt-7"
                }
                onClick={() => {
                  setProductAmount(1);
                }}
              >
                Add to Cart
              </button>
              {/* Add more quantity to cart */}
              {productAmount > 0 && (
                <div>
                  <div className="flex items-center mt-20">
                    <button
                      className={
                        isProductAdded.status
                          ? "hidden"
                          : "mr-6 text-4xl text-white bg-[#C7253E] px-3 rounded-full hover:cursor-pointer"
                      }
                      onClick={handleDecreaseAmount}
                    >
                      -
                    </button>
                    <div
                      className={
                        isProductAdded.status
                          ? "hidden"
                          : "text-2xl font-medium"
                      }
                    >
                      {productAmount}
                    </div>
                    <button
                      className={
                        isProductAdded.status
                          ? "hidden"
                          : "mx-6 text-4xl text-white bg-[#C7253E] px-2 rounded-full hover:cursor-pointer"
                      }
                      onClick={handleIncreaseAmount}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={
                      isProductAdded.status
                        ? "hidden"
                        : "bg-blue-600 px-4 py-2 rounded-sm mt-4 text-xl"
                    }
                    onClick={handleCart}
                  >
                    Add to Cart
                  </button>
                  {isProductAdded.status && (
                    <div className="text-green-500 text-xl mt-4">
                      {isProductAdded.msg}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Description */}
          <div className="w-84 ">
            <h1 className="text-xl sm:text-3xl font-bold w-80 sm:w-96 mx-4 sm:mx-2 my-2 uppercase ">
              {product.name}
            </h1>
            <p className="font-serif mx-3 ">{product.description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Product;
