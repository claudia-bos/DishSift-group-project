import React, { useState, useEffect } from "react";
import axios from "axios";

//currentIndex starts at 0, meaning it will start showing from the first recipe
//the handlerPrevButton 's will update the carousel so it will show the previous and the next recipes depending in where the current index is

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [detailedRecipes, setDetailedRecipes] = useState([]);

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
            url: recipeDetails.data.sourceUrl,
          };
          console.log(detailedRecipe); // Log detailed recipe data
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
                <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                  {recipe.label}
                </a>
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
