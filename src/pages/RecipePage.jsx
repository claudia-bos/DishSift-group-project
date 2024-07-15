import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

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
    try {
      await axios.post("/api/favorites", { userId, recipeId });
      setIsFavorite(true);
    } catch (error) {
      console.error("Error adding to favorites:", error);
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
    <div>
      <h1>{recipe.label}</h1>
      <img src={`${recipe.image}.jpg`} alt="recipe_image" />
      <p>
        <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
          See full recipe here
        </a>
      </p>
      <button onClick={handleAddToFavorites}>
        {isFavorite ? "Added to Favorites" : "Add to Favorites"}
      </button>

      <div>
        <h2>Nutritional Information</h2>
        <div>
          <div>Calories: {Math.round(recipe.calories)}</div>
          <div>Total Weight: {Math.round(recipe.totalWeight)} grams</div>
          <div>Total Time: {recipe.totalTime} minutes</div>
          <div>Meal Type: {recipe.mealType}</div>
          <div>Dish Type: {recipe.dishType}</div>
        </div>
      </div>

      <div>
        <h2>Ingredients</h2>
        <div>
          {ingredients.map((ingredient) => (
            <div key={ingredient.ingredientId}>{ingredient.text}</div>
          ))}
        </div>
      </div>
      <div>
        <h2>Health Labels</h2>
        <div>
          {labels.map((label) => (
            <div key={label.labelId}>{label.labelName}</div>
          ))}
        </div>
      </div>
      <div>
        <h2>Rate this Recipe</h2>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRatingChange(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "black" : "lightgrey",
                fontSize: "1.5rem",
              }}
            >
              {star}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2>{isEditing ? "Edit your Review" : "Leave a Review"}</h2>
        <form
          onSubmit={isEditing ? handleEditReviewSubmit : handleReviewSubmit}
        >
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us what you think..."
            onFocus={handleFocus}
            disabled={!userId}
          ></textarea>
          <button type="submit" disabled={!userId}>
            {isEditing ? "Save Changes" : "Submit"}
          </button>
        </form>
      </div>

      <div>
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.ratingId}>
              <strong>{rev.user.username}</strong> rated it {rev.score} stars
              <p>{rev.comment}</p>
              {rev.user.userId === userId && (
                <div>
                  <button onClick={() => initiateEdit(rev)}>Edit</button>
                  <button onClick={() => handleReviewDelete(rev.ratingId)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default RecipePage;
