import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { useGlobalContext } from "../ThemeContext";

const AdminReviews = () => {
  const { baseUrl } = useGlobalContext();
  const [data, setData] = useState();
  const [editReview, setEditReview] = useState({
    id: "",
    title: "",
    description: "",
    rating: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [dataNotAvailable, setDataNotAvailable] = useState(false);

  const fetchReviews = async () => {
    const reviewResponse = await fetch(`${baseUrl}/review`, {
      credentials: "include",
    });
    const reviews = await reviewResponse.json();
    if (reviewResponse.status === 404) {
      setDataNotAvailable(true);
    } else {
      setData(reviews);
      console.log(reviews);
    }
  };

  const handleReviewEdit = async (e) => {
    e.preventDefault();
    const { title, description, rating, id } = editReview;
    const editResponse = await fetch(`${baseUrl}/review/updateReview/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rating,
        title,
        description,
      }),
      credentials: "include",
    });
    const isEdited = await editResponse.json();
    console.log(isEdited);
    window.location.reload();
  };
  const handleReviewDelete = async (id) => {
    const deleteResponse = await fetch(`${baseUrl}/review/deleteReview/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    const isDeleted = await deleteResponse.json();
    console.log(isDeleted);
    window.location.reload();
  };
  useEffect(() => {
    fetchReviews();
  }, []);
  return (
    <>
      <div className="text-4xl font-bold ml-6 my-12">Admin Reviews Panel</div>
      {/* If reviews not available */}
      {dataNotAvailable && (
        <div className="text-3xl ml-10 mt-20">No reviews available.... </div>
      )}
      {isEditing && (
        <form className="h-92 w-80 ml-20 bg-gray-300 rounded-md p-5">
          <div className="flex flex-col">
            <label htmlFor="name  ">Title</label>
            <input
              type="text"
              placeholder="Product Name"
              name="name"
              className="border-b-[#4491e9] border-2 h-11 w-fit my-2 mx-1 placeholder:font-serif p-2"
              value={editReview.title}
              onChange={(e) =>
                setEditReview({ ...editReview, title: e.currentTarget.value })
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              placeholder="Write about product"
              name="]description"
              className="border-b-[#4491e9] border-2 placeholder:text-wrap w-fit my-2 mx-1 placeholder:font-serif p-2"
              value={editReview.description}
              onChange={(e) =>
                setEditReview({
                  ...editReview,
                  description: e.currentTarget.value,
                })
              }
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              placeholder="Enter rating"
              name="rating"
              value={editReview.rating}
              onChange={(e) =>
                setEditReview({
                  ...editReview,
                  rating: Number(e.currentTarget.value),
                })
              }
              className="border-b-[#4491e9] border-2 h-11 w-fit my-2 mx-1 placeholder:font-serif p-2"
            />
          </div>
          <button
            className="w-full p-2 bg-black text-white rounded-md mt-4"
            onClick={(e) => handleReviewEdit(e)}
          >
            Update Review
          </button>
        </form>
      )}
      {data && (
        <div className="mx-10 mt-12">
          <h1 className="text-3xl mb-6">Reviews</h1>
          {data.reviews.map((review) => {
            const {
              _id: id,
              user,
              product,
              title,
              rating,
              description,
            } = review;
            return (
              <div
                key={id}
                className="flex place-content-between bg-gray-200 my-4 rounded-sm px-4 py-3 hover:bg-gray-300 hover:cursor-pointer"
              >
                <div className="my-4">
                  <p className="font-bold">
                    Product: <span className="font-normal">{product}</span>
                  </p>
                  <p className="font-bold">
                    User: <span className="font-normal">{user}</span>
                  </p>
                  <p className="font-bold">
                    Title: <span className="font-normal">{title}</span>
                  </p>
                  <p className="font-bold">
                    Rating: <span className="font-normal">{rating}</span>
                  </p>
                  <p className="font-bold">
                    Description:{" "}
                    <span className="font-normal">{description}</span>
                  </p>
                </div>
                {/* Button container */}
                <div className="flex mt-8">
                  <FaEdit
                    className="mx-6 text-2xl hover:cursor-pointer"
                    onClick={() => {
                      setIsEditing(true);
                      setEditReview({
                        ...editReview,
                        title,
                        description,
                        rating,
                        id,
                      });
                    }}
                  />
                  <MdDelete
                    className="mx-6 text-2xl hover:cursor-pointer"
                    onClick={() => handleReviewDelete(id)}
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

export default AdminReviews;
