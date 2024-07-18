import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import RecipeCard from "../components/recipeCard/RecipeCard.jsx";
import PantryFoods from "../components/pantry/PantryFoods.jsx";
import PantryInput from "../components/pantry/PantryInput.jsx";
import PageButtons from "../components/pageButtons/PageButtons.jsx";
import { LiaCookieBiteSolid } from "react-icons/lia";

const PantryPage = () => {
  const userId = useSelector((state) => state.userId);

  const [pantryRecipeData, setPantryRecipeData] = useState([]);
  const [countOfRecipes, setCountOfRecipes] = useState(0);
  const [pantryFoodData, setPantryFoodData] = useState([]);
  const [pantryPageNumber, setPantryPageNumber] = useState(0);
  const [togglePage, setTogglePage] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);

  const toggleThePage = () => setTogglePage(!togglePage);

  useEffect(() => {
    if (userId) {
      window.scroll({ top: 0, left: 0, behavior: "smooth" });

      setLoadingResults(true);
      axios
        .get(`/api/pantry/recipes/${userId}/${pantryPageNumber}`)
        .then((res) => {
          setPantryRecipeData(res.data.recipes);
          setCountOfRecipes(res.data.totalMatchedRecipes);
          setLoadingResults(false);
        });
      axios.get(`/api/pantry/foods/${userId}`).then((res) => {
        setPantryFoodData(res.data);
      });
    }
  }, [userId, togglePage]);

  const recipes = pantryRecipeData.map((el) => (
    <RecipeCard recipe={el} showMatchedIngredients={true} key={el.recipeId} />
  ));

  const userFoods = pantryFoodData.map((el) => (
    <PantryFoods
      food={el}
      key={el.foodId}
      setPantryFoodData={setPantryFoodData}
      setPantryRecipeData={setPantryRecipeData}
      setCountOfRecipes={setCountOfRecipes}
      setPantryPageNumber={setPantryPageNumber}
      toggleThePage={toggleThePage}
      userId={userId}
    />
  ));

  return (
    <div className="mt-24 mb-4 px-4 scroll-smooth">
      <div className="mx-12">
        <h1 className="text-4xl">Pantry</h1>
        <div className="flex flex-col">
          <span>
            Here is where you can add your available ingredients and find
            recipes that use your ingredients.
          </span>
          <span>
            Recipes are ordered by the percentage of a recipe's total
            ingredients you currently have in your pantry.
          </span>
        </div>
      </div>
      <div className="mx-12 mt-4 px-4 pt-2 pb-4 rounded-lg bg-primary-50 drop-shadow-md">
        <div className="text-2xl flex justify-center">Your Ingredients</div>
        <div className="flex justify-center mt-2 mb-4">
          <PantryInput
            setPantryFoodData={setPantryFoodData}
            setPantryRecipeData={setPantryRecipeData}
            setCountOfRecipes={setCountOfRecipes}
            setPageNumber={setPantryPageNumber}
            toggleThePage={toggleThePage}
            userId={userId}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {userFoods}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-center">
          <h1 className="text-2xl">Matched Recipes</h1>
        </div>
        <div className="m-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-8">
          {recipes}
        </div>
        {loadingResults && (
          <div className="fixed left-0 top-0 z-50 block h-full w-full bg-white opacity-75">
            <div className="flex justify-center relative top-1/2 mx-auto my-0 opacity-85">
              <div role="status">
                <LiaCookieBiteSolid className="text-9xl text-secondary-800 animate-spin" />
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {!loadingResults && (
        <PageButtons
          itemsPerPage={20}
          totalItemsCount={countOfRecipes}
          desiredPageNumber={pantryPageNumber}
          setPageNumber={setPantryPageNumber}
          toggleThePage={toggleThePage}
        />
      )}
    </div>
  );
};

export default PantryPage;
