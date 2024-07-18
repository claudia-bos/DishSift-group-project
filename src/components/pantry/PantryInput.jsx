import axios from "axios";
import { useState, useEffect } from "react";
import PantryAutoFill from "./PantryAutofill";

const PantryInput = ({
  setPantryFoodData,
  setPantryRecipeData,
  userId,
  setCountOfRecipes,
  setPageNumber,
  toggleThePage,
}) => {
  const [allFoodData, setAllFoodData] = useState([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    axios.get("/api/pantry/foods/all").then((res) => {
      setAllFoodData(res.data);
    });
  }, []);

  const handleKeyPress = (e) => {
    setInputText(e.target.value);
    console.log("inputText:", inputText);
  };

  const autoFillOptions = allFoodData.map(
    (el) =>
      inputText != "" &&
      el.foodName.slice(0, inputText.length) === inputText && (
        <PantryAutoFill
          food={el}
          key={el.foodId}
          inputText={inputText}
          setInputText={setInputText}
          setPantryFoodData={setPantryFoodData}
          setPantryRecipeData={setPantryRecipeData}
          setCountOfRecipes={setCountOfRecipes}
          setPageNumber={setPageNumber}
          toggleThePage={toggleThePage}
          userId={userId}
        />
      )
  );

  return (
    <div className="w-full">
      <input
        type="text"
        value={inputText}
        onChange={handleKeyPress}
        placeholder="Add an ingredient"
        className="px-2 ring-1 focus:ring-2 ring-primary-800 focus:ring-primary-600 focus:outline-none rounded-md"
      />
      <div className="grid gap-2 grid-cols-2 mt-4 md:grid-cols-3 lg:grid-cols-4">
        {autoFillOptions}
      </div>
    </div>
  );
};

export default PantryInput;
