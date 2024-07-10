import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const RecipePage = () => {
  const { recipeId } = useParams();
  const { state } = useLocation();
  console.log(state);
  const [recipe, setRecipe] = useState(state?.recipe || null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    if (!recipe) {
      const fetchRecipe = async () => {
        try {
          const res = await axios.get(`/api/recipes/${recipeId}`);
          setRecipe(res.data);
        } catch (error) {
          console.error("Error fetching recipes:", error);
        }
      };
      fetchRecipe();
    }
  }, [recipe, recipeId]);

  const handleAddToFavorites = async () => {
    try {
      await axios.post("/api/favorites", { recipeId });
      setIsFavorite(true);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/recipes/ratings/new", {
        recipeId,
        score: rating,
        Comment: review,
      });
      setReview("");
      setRating(0);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{recipe.label}</h1>
      <img src={recipe.largeImage} />
      <p>
        <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
          See full recipe
        </a>
      </p>
      <button onClick={handleAddToFavorites}>
        {isFavorite ? "Added to Favorites" : "Add to Favorites"}
      </button>
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
        <h2>Leave a Review</h2>
        <form onSubmit={handleReviewSubmit}>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Tell us what you think"
          ></textarea>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RecipePage;
