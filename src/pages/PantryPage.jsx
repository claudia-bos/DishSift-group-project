import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import PantryRecipes from "../components/pantry/PantryRecipes.jsx";
import PantryFoods from "../components/pantry/PantryFoods.jsx";
import PantryInput from "../components/pantry/PantryInput.jsx";
import PantryButton from "../components/pantry/PantryButton.jsx";

// TODO: Update with the correct API , it might need other changes in order to make it work
const PantryPage = () => {
  const userId = useSelector((state) => state.userId);

  const [pantryRecipeData, setPantryRecipeData] = useState([]);
  const [pantryFoodData, setPantryFoodData] = useState([]);
  const [queryButtons, setQueryButtons] = useState([]);

  let queryPageNum = 0;
  const buttonCount = [];

  useEffect(() => {
    if (userId) {
      axios.get(`/api/pantry/recipes/${userId}/${queryPageNum}`).then((res) => {
        setPantryRecipeData(res.data);
        if (res.data.length === 20) {
          handleNextButton(res.data);
        }
      });
      axios.get(`/api/pantry/foods/${userId}`).then((res) => {
        setPantryFoodData(res.data);
      });
    }
  }, [userId]);

  // console.log("pantryRecipeData:", pantryRecipeData);
  // console.log("pantryFoodData:", pantryFoodData);

  const handleNextButton = async (thisQuery) => {
    if (thisQuery.length === 20) {
      buttonCount.push(queryPageNum);
      queryPageNum++;

      const nextQuery = await axios.get(
        `/api/pantry/recipes/${userId}/${queryPageNum}`
      );
      handleNextButton(nextQuery.data);
    } else {
      setQueryButtons([...buttonCount]);
    }
  };

  const recipes = pantryRecipeData.map((el) => (
    <PantryRecipes
      recipe={el}
      key={el.recipeId}
      pantryFoodData={pantryFoodData}
    />
  ));

  const userFoods = pantryFoodData.map((el) => (
    <PantryFoods
      food={el}
      key={el.foodId}
      setPantryFoodData={setPantryFoodData}
      setPantryRecipeData={setPantryRecipeData}
      userId={userId}
    />
  ));

  const allPantryButtons = queryButtons.map((el) => (
    <PantryButton
      userId={userId}
      key={el}
      pageNum={el}
      setPantryRecipeData={setPantryRecipeData}
    />
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
          <PantryInput
            setPantryFoodData={setPantryFoodData}
            setPantryRecipeData={setPantryRecipeData}
            userId={userId}
          />
        </div>
        <div>{userFoods}</div>
        <div>{allPantryButtons}</div>
      </div>
    </div>
  );
};

export default PantryPage;
