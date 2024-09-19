import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useGlobalContext } from "../ThemeContext";
import Skeleton from "react-loading-skeleton";

const AdminProduct = () => {
  const { baseUrl, user } = useGlobalContext();
  const [data, setData] = useState();
  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    description: "",
    image: null,
    freeShipping: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: "", msg: "" });

  const fetchProducts = async () => {
    const productResponse = await fetch(`${baseUrl}/product`, {
      credentials: "include",
    });
    const products = await productResponse.json();
    if (productResponse.status === 404) {
      setData();
    } else {
      setData(products);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, price, description, image, freeShipping } = product;
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("freeShipping", freeShipping);

      const submitResponse = await fetch(`${baseUrl}/product/createProduct`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (submitResponse.status === 201) {
        await submitResponse.json();

        // window.location.reload();
        // success message
        setMessage({
          type: "success",
          msg: "Product Added",
        });
        // unauthorized error
      } else if (submitResponse.status === 401) {
        setMessage({
          type: "error",
          msg: "Unauthorized to perform operation",
        });
      }
      // error message
      else {
        setMessage({
          type: "error",
          msg: "Please enter a suitable name and description",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductEdit = async (e) => {
    e.preventDefault();
    const { id, name, price, description, image } = product;
    const editResponse = await fetch(`${baseUrl}/product/updateProduct/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        description,
        image,
      }),
      credentials: "include",
    });
    const isEdited = await editResponse.json();
    if (editResponse.status === 200) {
      window.location.reload();
    }
    console.log(isEdited);
  };
  const handleProductDelete = async (id) => {
    await fetch(`${baseUrl}/product/deleteProduct/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    window.location.reload();
  };
  useEffect(() => {
    fetchProducts();
    // clear error message
    const timer = setTimeout(() => {
      setMessage({ type: "", msg: "" });
    }, 3000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <>
      <div className="text-4xl font-bold ml-16 my-12">Admin Products Panel</div>
      <form
        className="h-92 w-96 ml-20 bg-gray-300 rounded-md p-5"
        onSubmit={(e) => {
          isEditing ? handleProductEdit(e) : handleProductSubmit(e);
        }}
      >
        <div className="flex flex-col">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            placeholder="Product name"
            name="name"
            className="border-b-[#4491e9] border-2 h-11 w-fit my-2 mx-1 placeholder:font-serif p-2"
            value={product.name}
            onChange={(e) =>
              setProduct({ ...product, name: e.currentTarget.value })
            }
          />
        </div>
        <div className="flex">
          <div className="flex flex-col">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              placeholder="Enter price"
              name="price"
              className="border-b-[#4491e9] border-2 h-11 w-28 my-2 mx-1 placeholder:font-serif p-2"
              value={product.price}
              onChange={(e) =>
                setProduct({
                  ...product,
                  price: Number(e.currentTarget.value),
                })
              }
            />
          </div>
          <div className="mx-4">
            <label htmlFor="image">Image</label>
            <input
              type="file"
              className="my-4"
              onChange={(e) =>
                setProduct({ ...product, image: e.currentTarget.files[0] })
              }
            />
          </div>
        </div>
        <div className="flex flex-col my-2">
          <label htmlFor="freeShipping">Shipping Charges</label>
          <select
            name="freeShipping-select"
            id="freeShipping"
            className="my-2 p-1"
            value={product.freeShipping}
            onChange={(e) =>
              setProduct({
                ...product,
                freeShipping: Boolean(e.currentTarget.value),
              })
            }
          >
            <option value="">--Please choose an option--</option>
            <option value="true">Free Shipping</option>
            <option value="false">Shipping Charges</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            placeholder="Write about product"
            className="border-b-[#4491e9] border-2 h-20 my-2 mx-1 placeholder:font-serif p-2"
            value={product.description}
            onChange={(e) => {
              setProduct({
                ...product,
                description: e.currentTarget.value,
              });
            }}
          />
        </div>
        <button className="w-full p-2 bg-black text-white rounded-md mt-4">
          {isEditing ? "Edit" : "Add Product"}
        </button>
        {message && (
          <div
            className={
              message.type === "error"
                ? "text-red-600 my-2 text-center"
                : "text-green-600 my-2 text-center"
            }
          >
            {message.msg}
          </div>
        )}
      </form>
      {/* If no products are available */}
      {!data && (
        <div className="text-3xl ml-10 mt-20">No products available...</div>
      )}
      {data && (
        <div className="mx-10 mt-12 text-xl">
          <h1 className="text-3xl mb-6 font-semibold">Products</h1>
          {data.products.map((product) => {
            const {
              _id: id,
              name,
              price,
              description,
              image,
              rating,
              freeShipping,
              numOfReviews,
            } = product;
            return (
              <div
                key={id}
                className="flex place-content-between bg-gray-200 my-4 rounded-sm px-4 py-3 hover:bg-gray-300 hover:cursor-pointer"
              >
                <div className="my-4">
                  <p className="font-bold">
                    Name: <span className="font-normal">{name}</span>
                  </p>
                  <p className="font-bold">
                    Price: <span className="font-normal">${price}</span>
                  </p>
                  <p className="font-bold">
                    Description:{" "}
                    <span className="font-normal">{description}</span>
                  </p>
                  <p className="font-bold">
                    Image: <span className="font-normal">{image}</span>
                  </p>
                  <p className="font-bold">
                    Rating: <span className="font-normal">{rating}</span>
                  </p>
                  <p className="font-bold">
                    FreeShipping:{" "}
                    <span className="font-normal">
                      {freeShipping ? "true" : "false"}
                    </span>
                  </p>
                  <p className="font-bold">
                    NumOfReviews:{" "}
                    <span className="font-normal">{numOfReviews}</span>
                  </p>
                </div>
                {/* Button container */}
                <div className="flex mt-8">
                  <FaEdit
                    className="mx-6 text-2xl hover:cursor-pointer"
                    onClick={() => {
                      setIsEditing(true);
                      setProduct({
                        ...product,
                        id,
                        name,
                        price,
                        description,
                        image,
                      });
                    }}
                  />
                  <MdDelete
                    className="mx-6 text-2xl hover:cursor-pointer"
                    onClick={() => handleProductDelete(id)}
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

export default AdminProduct;
