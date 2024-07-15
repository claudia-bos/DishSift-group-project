import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

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
    <div className="relative w-full max-w-6xl mx-auto mt-8">
      <h2 className="text-3xl text-center mb-8">Most Popular Recipes</h2>

      <div className="relative flex items-center justify-between">
        <button onClick={handlePrevButton}>
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <div className="w-full overflow-hidden">
          <div className="flex">
            {detailedRecipes
              .slice(currentIndex, currentIndex + 4)
              .map((recipe, index) => (
                <div key={index} className="w-1/4 p-4 flex-shrink-0">
                  <div className="p-4">
                    <img src="{recipe.image}" />
                    <h3 className="text-lg font-medium text-center mt-4">
                      <Link
                        to={`/recipe-page/${recipe.recipeId}`}
                        state={recipe}
                      >
                        {recipe.label}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-center mt-2">
                      <StarIcon className="h-5 w-5" />
                      <p className="text-xl ml-1">{recipe.averageScore}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <button onClick={handleNextButton}>
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
