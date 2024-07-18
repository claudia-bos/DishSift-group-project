import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  HeartIcon,
  StarIcon,
  PencilSquareIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

const RecipePage = () => {
  const userId = useSelector((state) => state.userId); // Get the userId from Redux store
  const { recipeId } = useParams();
  const { state } = useLocation();

  //Defining state variables
  const [recipe, setRecipe] = useState(state?.recipe || null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]); // State to store reviews
  const [isEditing, setIsEditing] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [labels, setLabels] = useState([]);

  // Fetch recipe and reviews on component mount
  useEffect(() => {
    window.scroll({ top: 0, left: 0 });
    const fetchRecipeAndReviews = async () => {
      try {
        if (!recipe) {
          const res = await axios.get(`/api/recipes/${recipeId}`);
          setRecipe(res.data);
        }

        // Fetch reviews for the recipe
        const reviewsResponse = await axios.get(
          `/api/recipes/ratings/${recipeId}`
        );
        console.log("Reviews data:", reviewsResponse.data); // Debugging
        setReviews(reviewsResponse.data);

        const ingredientsResponse = await axios.get(
          `/api/recipes/ingredients/${recipeId}`
        );
        console.log("Ingredients data:", ingredientsResponse.data); // Debugging
        setIngredients(ingredientsResponse.data);

        const labelsResponse = await axios.get(
          `/api/recipes/labels/${recipeId}`
        );
        console.log("Labels data:", labelsResponse.data); // Debugging
        setLabels(labelsResponse.data);
      } catch (error) {
        console.error("Error fetching recipes or reviews:", error);
      }
    };

    fetchRecipeAndReviews();
  }, [recipe, recipeId]);

  // Handle adding to favorites
  const handleAddToFavorites = async () => {
    if (!userId) {
      alert("Please log in or sign up to add this recipe to favorites.");
      return;
    }

    if (isFavorite) {
      alert("You have already added this recipe to favorites.");
    } else {
      try {
        await axios.post("/api/favorites", { userId, recipeId });
        setIsFavorite(true);
      } catch (error) {
        console.error("Error adding to favorites:", error);
        alert("An error occurred while adding to favorites. Please try again.");
      }
    }
  };

  // Handle rating change
  const handleRatingChange = (newRating) => {
    if (!userId) {
      alert("Please log in or sign up to rate the recipe.");
      return;
    }
    setRating(newRating);
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please log in or sign up to leave a review.");
      return;
    }

    try {
      await axios.post("/api/recipes/ratings/new", {
        recipeId,
        score: rating,
        comment: review,
      });
      setReview("");
      setRating(0);

      // Fetch updated reviews after submission
      const reviewsResponse = await axios.get(
        `/api/recipes/ratings/${recipeId}`
      );
      console.log(reviewsResponse.data);
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  //Initiate edit mode
  const initiateEdit = (review) => {
    setIsEditing(true);
    setEditReview(review);
    setReview(review.comment);
    setRating(review.score);
  };
  //Handle edited review submission
  const handleEditReviewSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please log in or sign up to edit your review.");
      return;
    }

    try {
      await axios.put(`/api/recipes/ratings/edit/${editReview.ratingId}`, {
        comment: review,
        score: rating,
      });
      setReview("");
      setRating(0);
      setIsEditing(false);
      setEditReview(null);

      //fetching updated reviews after editing
      const reviewsResponse = await axios.get(
        `/api/recipes/ratings/${recipeId}`
      );
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error("Error editing review:", error);
    }
  };

  //handle review deletion
  const handleReviewDelete = async (reviewId) => {
    if (!userId) {
      alert("Please log in or sign up to delete your review");
      return;
    }

    try {
      await axios.delete(`/api/recipes/ratings/delete/${reviewId}`);

      // Update the state to remove the deleted review
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.ratingId !== reviewId)
      );
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  //function to handle focus on input /textarea if not logged in
  const handleFocus = (e) => {
    if (!userId) {
      e.preventDefault();
      alert("PLEASE log in or sign up to leave a review.");
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  // console.log("userId from Redux store:", userId);

  return (
    <div className="max-w-full mx-auto px-4 pt-24  bg-gray-200">
      <div className="mx-12 pb-8">
        <h1 className="text-4xl font-bold mb-5 text-primary-1000">
          {recipe.label}
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <img
              src={`${recipe.image}.jpg`}
              alt="recipe_image"
              className="w-full rounded-md shadow-md"
            />

            <div className="mt-4 border rounded-md overflow-hidden">
              <div className="bg-other-gray p-2">
                <h2 className="text-lg font-semibold text-black">
                  Nutritional Information
                </h2>
              </div>
              <div className="p-4 grid grid-cols-2 gap-3 text-stone-900 bg-slate-200">
                <div>Calories: {Math.round(recipe.calories)}</div>
                <div>Meal Type: {recipe.mealType}</div>
                <div>Total Weight: {Math.round(recipe.totalWeight)}g</div>
                <div>Dish Type: {recipe.dishType}</div>
                <div>Total Time: {recipe.totalTime} mins</div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-medium text-black">Ingredients</h2>
              <ul className="ml-4 mt-2 space-y-2">
                {ingredients.map((ingredient) => (
                  <li
                    key={ingredient.ingredientId}
                    className="list-yellow-disc"
                  >
                    <span>{ingredient.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5">
              <h2 className="text-xl font-medium text-black">Health Tags</h2>
              <div className="flex flex-wrap gap-2 mt-2 text-sm">
                {labels.map((label) => (
                  <div
                    key={label.labelId}
                    className="text-primary-1000 p-2 rounded border-2 border-secondary-500"
                  >
                    {label.labelName}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 lg:pr-14">
            <div className="mt-4 flex items-center text-xl">
              <button
                onClick={handleAddToFavorites}
                className="flex items-center text-black"
              >
                <HeartIcon className="h-6 w-6 text-other-heartColor mr-1" />
                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
              </button>
            </div>

            <p className="mt-4">
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-1000 underline"
              >
                See full recipe here
              </a>
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-medium text-black">
                Rate this Recipe
              </h2>
              <div className="flex mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className={`h-8 w-8 cursor-pointer ${
                      star <= rating ? "text-secondary-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-medium text-black">
                {isEditing ? "Edit your Review" : "Leave a Review"}
              </h2>
              <form
                onSubmit={
                  isEditing ? handleEditReviewSubmit : handleReviewSubmit
                }
                className="mt-2"
              >
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Tell us what you think..."
                  onFocus={handleFocus}
                  disabled={!userId}
                  className="w-full max-w-md p-2 border rounded resize-none h-24 focus:outline-none border-other-gray"
                ></textarea>

                <button
                  type="submit"
                  disabled={!userId}
                  className="mt-2 block w-min px-4 py-2 rounded text-white  bg-other-buttons hover:bg-other-hover"
                >
                  {isEditing ? "Save Changes" : "Submit"}
                </button>
              </form>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-semibold text-black">Reviews</h2>
              <hr className="border-gray-300 mb-4" />
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev.ratingId} className="mt-4 text-black">
                    <div className="flex items-center mb-1">
                      <UserCircleIcon className="h-5 w-5 mr-1" />
                      <strong>{rev.user.username}</strong>
                      {/* {rev.score}{" "} */}
                      <span className="ml-2">
                        {rev.createdAt.replace(
                          /^(\d{4})(-)(\d{2})(-)(\d{2}).+/g,
                          "$3/$5/$1"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 space-x-1">
                      {[1, 2, 3, 4].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-4 w-4 ${
                            star <= rev.score
                              ? "text-secondary-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2">{rev.comment}</p>
                    {rev.user.userId === userId && (
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => initiateEdit(rev)}
                          className="px-2 py-1 bg-other-buttons hover:bg-other-hover text-white rounded"
                        >
                          <PencilSquareIcon className="h-5 w-5 mr-1" />
                        </button>
                        <button
                          onClick={() => handleReviewDelete(rev.ratingId)}
                          className="px-2 py-1 bg-other-buttons hover:bg-other-hover text-white rounded"
                        >
                          <TrashIcon className="h-5 w-5 mr-1" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No coments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
