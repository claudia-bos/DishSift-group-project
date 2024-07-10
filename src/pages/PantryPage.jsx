import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import PantryRecipes from "../components/pantry/PantryRecipes.jsx";
import PantryFoods from "../components/pantry/PantryFoods.jsx";
import PantryInput from "../components/pantry/PantryInput.jsx";

// TODO: Update with the correct API , it might need other changes in order to make it work
const PantryPage = () => {
  const userId = useSelector((state) => state.userId);

  const [pantryRecipeData, setPantryRecipeData] = useState([]);
  const [pantryFoodData, setPantryFoodData] = useState([]);

  useEffect(() => {
    if (userId) {
      axios.get(`/api/pantry/recipes/${userId}/0`).then((res) => {
        setPantryRecipeData(res.data);
      });
      axios.get(`/api/pantry/foods/${userId}`).then((res) => {
        setPantryFoodData(res.data);
      });
    }
  }, []);

  console.log("pantryRecipeData:", pantryRecipeData);
  console.log("pantryFoodData:", pantryFoodData);

  const recipes = pantryRecipeData.map((el) => (
    <PantryRecipes recipe={el} key={el.recipeId} />
  ));

  const userFoods = pantryFoodData.map((el) => (
    <PantryFoods food={el} key={el.foodId} />
  ));

  return (
    <div>
      <h1>Pantry</h1>
      <div>
        <h1>Matched Recipes</h1>
        {recipes}
      </div>
      <div>
        <h1>User Foods</h1>
        <div>
          <PantryInput setPantryFoodData={setPantryFoodData} />
        </div>
        {userFoods}
      </div>
    </div>
  );
};

export default PantryPage;
