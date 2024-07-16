import axios from "axios";

const PantryAutoFill = ({
  food,
  inputText,
  setInputText,
  setPantryFoodData,
  setPantryRecipeData,
  userId,
}) => {
  const handleClick = async () => {
    setInputText("");
    await axios.post("/api/pantry/add", {
      userId: userId,
      foodId: food.foodId,
    });
    await axios.get(`/api/pantry/recipes/${userId}/0`).then((res) => {
      setPantryRecipeData(res.data.recipes);
    });
    await axios.get(`/api/pantry/foods/${userId}`).then((res) => {
      setPantryFoodData(res.data);
    });
  };

  return (
    <div>
      {inputText != "" &&
        food.foodName.slice(0, inputText.length) === inputText && (
          <p onClick={handleClick}>{food.foodName}</p>
        )}
    </div>
  );
};

export default PantryAutoFill;
