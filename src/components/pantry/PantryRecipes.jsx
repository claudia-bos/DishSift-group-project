import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PantryRecipes = ({ recipe, pantryFoodData }) => {
  const navigate = useNavigate();

  const [recipeIngredientData, setRecipeIngredientData] = useState([]);

  let matchCount = 0;

  useEffect(() => {
    axios.get(`/api/recipes/ingredients/${recipe.recipeId}`).then((res) => {
      setRecipeIngredientData(res.data);
    });
  }, []);

  if (recipeIngredientData.length >= 1) {
    for (let food of pantryFoodData) {
      for (let ingredient of recipeIngredientData) {
        if (food.foodId === ingredient.foodId) {
          matchCount++;
        }
      }
    }
  }

  return (
    <div>
      <p
        onClick={() => {
          navigate(`/recipe-page/${recipe.recipeId}`, {
            state: { recipe },
          });
        }}
      >
        {recipe.label}
      </p>
      <img src={`${recipe.image}.jpg`} alt="recipe_image" />
      <p>
        Ingredients matched: {matchCount}/{recipeIngredientData.length}
      </p>
    </div>
  );
};

export default PantryRecipes;
