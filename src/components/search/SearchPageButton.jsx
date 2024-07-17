import axios from "axios";

const SearchPageButton = ({
  pageNum,
  setAllRecipeData,
  setCountOfRecipes,
  inputText,
  filters,
}) => {
  const handleButtonPress = async () => {
    const newRecipeData = await axios.post(`/api/recipes/all/${pageNum}`, {
      inputText: inputText,
      filters: filters,
    });
    setAllRecipeData(newRecipeData.data.recipes);
    setCountOfRecipes(newRecipeData.data.totalMatchedRecipes);
  };
  return (
    <div>
      <button onClick={handleButtonPress}>{pageNum}</button>
    </div>
  );
};

export default SearchPageButton;
