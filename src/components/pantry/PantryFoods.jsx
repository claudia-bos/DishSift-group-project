import axios from "axios";

const PantryFoods = ({
  food,
  setPantryFoodData,
  setPantryRecipeData,
  userId,
}) => {
  const handleClick = async () => {
    await axios.delete(`/api/pantry/delete/${food.foodId}`);

    await axios.get(`/api/pantry/foods/${userId}`).then((res) => {
      setPantryFoodData(res.data);
    });

    await axios.get(`/api/pantry/recipes/${userId}/0`).then((res) => {
      setPantryRecipeData(res.data);
    });
  };
  return (
    <div>
      <p onClick={handleClick}>{food.foodName}</p>
    </div>
  );
};

export default PantryFoods;
