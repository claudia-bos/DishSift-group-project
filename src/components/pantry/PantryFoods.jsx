import axios from "axios";

const PantryFoods = ({ food }) => {
  const handleClick = async () => {
    await axios.delete(`/api/pantry/delete/${food.foodId}`);
  };
  return (
    <div>
      <p onClick={handleClick}>{food.foodName}</p>
    </div>
  );
};

export default PantryFoods;
