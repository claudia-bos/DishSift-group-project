import axios from "axios";
import { useState, useEffect } from "react";
import PantryAutoFill from "./PantryAutofill";

const PantryInput = ({ setPantryFoodData, setPantryRecipeData, userId }) => {
  const [allFoodData, setAllFoodData] = useState([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    axios.get("/api/pantry/foods/all").then((res) => {
      setAllFoodData(res.data);
    });
  }, []);

  console.log("allFoodData:", allFoodData);

  const handleKeyPress = (e) => {
    setInputText(e.target.value);
    console.log("inputText:", inputText);
  };

  const autoFillOptions = allFoodData.map((el) => (
    <PantryAutoFill
      food={el}
      key={el.foodId}
      inputText={inputText}
      setInputText={setInputText}
      setPantryFoodData={setPantryFoodData}
      setPantryRecipeData={setPantryRecipeData}
      userId={userId}
    />
  ));

  return (
    <div>
      <input type="text" defaultValue={inputText} onChange={handleKeyPress} />
      {autoFillOptions}
    </div>
  );
};

export default PantryInput;
