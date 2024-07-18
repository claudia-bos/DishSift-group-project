import axios from "axios";

const PantryAutoFill = ({
  food,
  inputText,
  setInputText,
  setPantryFoodData,
  userId,
  setPageNumber,
  toggleThePage,
}) => {
  const handleClick = async () => {
    setInputText("");
    await axios.post("/api/pantry/add", {
      userId: userId,
      foodId: food.foodId,
    });
    setPageNumber(0);
    toggleThePage();
    await axios.get(`/api/pantry/foods/${userId}`).then((res) => {
      setPantryFoodData(res.data);
    });
  };

  return (
    <div className="w-full py-2 px-4 rounded-lg hover:bg-primary-800 hover:text-primary-50 hover:cursor-pointer">
      <p onClick={handleClick}>{food.foodName}</p>
    </div>
  );
};

export default PantryAutoFill;
