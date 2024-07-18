import React, { useState, useEffect } from "react";
import axios from "axios";
import PageButtons from "../components/pageButtons/PageButtons.jsx";
import RecipeCard from "../components/recipeCard/RecipeCard.jsx";
import SearchPageButton from "../components/search/SearchPageButton.jsx";
import SearchPageInput from "../components/search/SearchPageInput.jsx";
import SearchPageFilters from "../components/search/SearchPageFilters.jsx";

const SearchPage = () => {
  const [allRecipeData, setAllRecipeData] = useState([]);
  const [queryButtons, setQueryButtons] = useState([]);
  const [labels, setLabels] = useState([]);
  const [inputText, setInputText] = useState("");
  const [filters, setFilters] = useState([]);
  const [countOfRecipes, setCountOfRecipes] = useState(0);
  const [searchPageNumber, setSearchPageNumber] = useState(0);
  const [togglePage, setTogglePage] = useState(false);

  const toggleThePage = () => setTogglePage(!togglePage);

  useEffect(() => {
    axios
      .post(`/api/recipes/all/${searchPageNumber}`, {
        inputText: inputText,
        filters: filters,
      })
      .then((res) => {
        setAllRecipeData(res.data.recipes);
        setCountOfRecipes(res.data.totalRecipes);
        window.scroll({ top: 0, left: 0, behavior: "smooth" });
      });
    axios.get(`/api/labels/all`).then((res) => {
      setLabels(res.data);
    });
  }, [togglePage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Filtering recipes...");
    setSearchPageNumber(0);
    setQueryButtons([]);
    toggleThePage();
  };

  const handleClearFilters = async () => {
    console.log("Clearing filters...");
    setSearchPageNumber(0);
    setQueryButtons([]);
    setInputText("");
    setFilters([]);
  };

  const allRecipes = allRecipeData.map((el) => (
    <RecipeCard recipe={el} key={el.recipeId} />
  ));

  const allQueryButtons = queryButtons.map((el) => (
    <SearchPageButton
      pageNum={el}
      key={el}
      setAllRecipeData={setAllRecipeData}
      setCountOfRecipes={setCountOfRecipes}
      inputText={inputText}
      filters={filters}
    />
  ));

  const allLabels = labels.map((el) => (
    <SearchPageFilters
      label={el.labelName}
      filters={filters}
      setFilters={setFilters}
      key={el.labelId}
    />
  ));

  return (
    <div className="pt-24 mb-4 px-4 scroll-smooth">
      <h1>Search Page</h1>
      <form action="submit" onSubmit={handleSubmit}>
        <SearchPageInput inputText={inputText} setInputText={setInputText} />
        {allLabels}
        <button onClick={handleClearFilters}>Clear Filters</button>
      </form>
      <div className="m-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-8">
        {allRecipes}
      </div>
      <PageButtons
        itemsPerPage={20}
        totalItemsCount={countOfRecipes}
        desiredPageNumber={searchPageNumber}
        setPageNumber={setSearchPageNumber}
        toggleThePage={toggleThePage}
      />
      <div>{allQueryButtons}</div>
    </div>
  );
};

export default SearchPage;
