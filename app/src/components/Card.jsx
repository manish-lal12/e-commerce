import React from "react";
import { Link } from "react-router-dom";

const Card = ({ id, name, image, price }) => {
  return (
    <Link to={`/products/${id}`} className="sm:pl-20">
      <div className="mt-4 ml-3 mx-4 sm:mx-4 sm:mt-10 sm:w-80">
        <div className="row-span-1 bg-white h-20 w-20 p-2 pl-4 sm:h-96 sm:w-80 flex sm:items-center sm:pl-16 shadow-lg shadow-[rgb(56,55,55)] rounded-lg">
          <img src={image} alt={name} className="sm:h-68 sm:w-44" />
        </div>
        <section className="flex place-content-around ">
          <div className="flex flex-col">
            {/* smaller screen */}
            <h1 className="text-sm sm:w-64 font-bold my-2 text-center sm:my-2 sm:hidden">
              {name.substring(0, 12) + "  ."}
            </h1>
            {/* larger screen */}
            <h1 className="text-sm sm:w-64 font-bold my-2 text-center sm:my-2 hidden sm:block">
              {name}
            </h1>
          </div>
          <div>
            <h1 className="sm:3xl sm:mt-2 font-bold sm:block hidden">
              ${price}
            </h1>
          </div>
        </section>
      </div>
    </Link>
  );
};

export default Card;
