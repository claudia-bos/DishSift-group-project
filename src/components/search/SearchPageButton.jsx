import axios from "axios";

const SearchPageButton = ({ pageNum, setAllRecipeData }) => {
  const handleButtonPress = async () => {
    const newRecipeData = await axios.get(`/api/recipes/all/${pageNum}`);
    setAllRecipeData(newRecipeData.data);
  };
  return (
    <div>
      <button onClick={handleButtonPress}>{pageNum}</button>
    </div>
  );
};

export default SearchPageButton;
