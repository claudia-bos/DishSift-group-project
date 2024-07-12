import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

//currentIndex starts at 0, meaning it will start showing from the first recipe
//the handlerPrevButton 's will update the carousel so it will show the previous and the next recipes depending in where the current index is

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [detailedRecipes, setDetailedRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("/api/caroussel/highest-rated");
        const recipes = response.data;

        const detailedRecipesPromises = recipes.map(async (recipe) => {
          const recipeDetails = await axios.get(
            `/api/recipes/${recipe.recipeId}`
          );
          const detailedRecipe = {
            ...recipe,
            label: recipeDetails.data.label,
            image: recipeDetails.data.regularImage,
            sourceUrl: recipeDetails.data.sourceUrl,
            averageScore: recipe.averageScore.toFixed(1), //format the rating to one decimal place
          };
          // console.log(detailedRecipe); // Log detailed recipe data
          return detailedRecipe;
        });

        const detailedRecipes = await Promise.all(detailedRecipesPromises);
        setDetailedRecipes(detailedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  if (!detailedRecipes.length) return <p>Loading recipes...</p>;

  const handlePrevButton = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? detailedRecipes.length - 1 : prevIndex - 1
    );
  };

  const handleNextButton = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === detailedRecipes.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      <button onClick={handlePrevButton}>left</button>
      <div>
        {detailedRecipes
          .slice(currentIndex, currentIndex + 4)
          .map((recipe, index) => (
            <div key={index}>
              <img src="{recipe.image}" />
              <h3>
                <Link to={`/recipe-page/${recipe.recipeId}`} state={recipe}>
                  {recipe.label}
                </Link>
              </h3>
              <p>Rating: {recipe.averageScore}</p>
            </div>
          ))}
      </div>
      <button onClick={handleNextButton}>right</button>
    </div>
  );
};

export default Carousel;
