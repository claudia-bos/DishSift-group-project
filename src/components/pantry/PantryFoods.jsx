import axios from "axios";

const PantryFoods = ({
  food,
  setPantryFoodData,
  userId,
  setPantryPageNumber,
  toggleThePage,
}) => {
  const handleClick = async () => {
    await axios.delete(`/api/pantry/delete/${food.foodId}`);

    await axios.get(`/api/pantry/foods/${userId}`).then((res) => {
      setPantryFoodData(res.data);
      setPantryPageNumber(0);
      toggleThePage();
    });
  };
  return (
    <div>
      <p onClick={handleClick}>{food.foodName}</p>
    </div>
  );
};

export default PantryFoods;
