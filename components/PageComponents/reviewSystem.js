"use client";

import React, { useState, useEffect } from "react";
import { Star, Edit, Trash2, Check, X } from "lucide-react";

const ReviewSystem = ({ listingId, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: 5,
  });

  // Fetch reviews when component mounts or listingId changes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews?listingId=${listingId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data.reviews);

        // Check if current user has already reviewed this listing
        if (userId) {
          const userReview = data.reviews.find(
            (review) => review.userId === userId
          );
          if (userReview) {
            setUserReview(userReview);
            setFormData({
              title: userReview.title,
              description: userReview.description,
              rating: userReview.rating,
            });
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [listingId, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const endpoint = userReview
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/${userReview.id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews`;

      const method = userReview ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          listingId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(
          userReview ? "Failed to update review" : "Failed to submit review"
        );
      }

      const data = await response.json();

      if (userReview) {
        // Update existing review
        setReviews((prev) =>
          prev.map((review) =>
            review.id === userReview.id ? data.review : review
          )
        );
        setUserReview(data.review);
      } else {
        // Add new review
        setReviews((prev) => [data.review, ...prev]);
        setUserReview(data.review);
      }

      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userReview) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/reviews/${userReview.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      setReviews((prev) =>
        prev.filter((review) => review.id !== userReview.id)
      );
      setUserReview(null);
      setFormData({
        title: "",
        description: "",
        rating: 5,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    if (userReview) {
      setFormData({
        title: userReview.title,
        description: userReview.description,
        rating: userReview.rating,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        rating: 5,
      });
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
        Customer Reviews
        {reviews.length > 0 && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({averageRating} out of 5 from {reviews.length} reviews)
          </span>
        )}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* User Review Section */}
      {userId && (
        <div className="mb-8 border-b pb-6">
          <h3 className="font-medium text-lg mb-4">
            {userReview ? "Your Review" : "Write a Review"}
          </h3>

          {!userReview || isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= formData.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength="100"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 mb-2"
                >
                  Review
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  maxLength="500"
                ></textarea>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {loading
                    ? "Submitting..."
                    : userReview
                    ? "Update Review"
                    : "Submit Review"}
                </button>

                {userReview && (
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= userReview.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{userReview.title}</span>
                  </div>
                  <p className="text-gray-600">{userReview.description}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={startEditing}
                    className="p-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                    title="Edit review"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
                    title="Delete review"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                Reviewed on{" "}
                {new Date(userReview.createdAt).toLocaleDateString()}
                {userReview.updatedAt &&
                  userReview.updatedAt !== userReview.createdAt && (
                    <span> (edited)</span>
                  )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Reviews List */}
      <div className="space-y-6">
        {loading && !reviews.length ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews
            .filter((review) => !userReview || review.id !== userReview.id)
            .map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">{review.title}</span>
                    </div>
                    <p className="text-gray-600">{review.description}</p>
                  </div>

                  <div className="text-sm text-gray-500">
                    {review.user?.firstName || "Anonymous"}
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-500">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  {review.updatedAt &&
                    review.updatedAt !== review.createdAt && (
                      <span> (edited)</span>
                    )}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;
