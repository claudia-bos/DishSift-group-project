import axios from "axios";

const PantryButton = ({ userId, pageNum, setPantryRecipeData }) => {
  const handleButtonPress = async () => {
    const newRecipeData = await axios.get(
      `/api/pantry/recipes/${userId}/${pageNum}`
    );
    console.log("newRecipeData:", newRecipeData.data);
    setPantryRecipeData(newRecipeData.data);
  };
  return (
    <div>
      <button onClick={handleButtonPress}>{pageNum}</button>
    </div>
  );
};

export default PantryButton;
