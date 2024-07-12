import React, { useState, useEffect } from "react";
import axios from "axios";
// import { query } from "express";
import SearchRecipes from "../components/search/SearchRecipes.jsx";
import SearchPageButton from "../components/search/SearchPageButton.jsx";
import SearchPageInput from "../components/search/SearchPageInput.jsx";
import SearchPageFilters from "../components/search/SearchPageFilters.jsx";

const SearchPage = () => {
  const [allRecipeData, setAllRecipeData] = useState([]);
  // const [queryPageNum, setQueryPageNum] = useState(0);
  const [queryButtons, setQueryButtons] = useState([]);
  const [labels, setLabels] = useState([]);
  const [inputText, setInputText] = useState("");
  const [filters, setFilters] = useState([]);

  let queryPageNum = 0;
  const test = [];

  useEffect(() => {
    axios
      .post(`/api/recipes/all/${queryPageNum}`, {
        inputText: inputText,
        filters: filters,
      })
      .then((res) => {
        setAllRecipeData(res.data);
        if (res.data.length === 20) {
          handleNextButton(res.data);
        }
      });
    axios.get(`/api/labels/all`).then((res) => {
      setLabels(res.data);
    });
  }, []);

  // useEffect(() => {
  //   if (allRecipeData.length === 20) {
  //     handleNextButton(allRecipeData);
  //   }
  // }, []);

  const handleNextButton = async (thisQuery) => {
    // console.log("You made it to the function");
    // console.log("thisQuery: ", thisQuery);
    if (thisQuery.length === 20) {
      test.push(queryPageNum);
      console.log("test:", test);
      // setQueryButtons([...test]);
      queryPageNum++;
      console.log("queryPageNum:", queryPageNum);
      const nextQuery = await axios.post(`/api/recipes/all/${queryPageNum}`, {
        inputText: inputText,
        filters: filters,
      });
      // console.log("nextQuery.data:", nextQuery.data);
      handleNextButton(nextQuery.data);
    } else {
      setQueryButtons([...test]);
      return console.log("Function should have stopped by now");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Filtering recipes...");
    queryPageNum = 0;
    setQueryButtons([]);

    const filteredRecipes = await axios.post(
      `/api/recipes/all/${queryPageNum}`,
      { inputText: inputText, filters: filters }
    );
    setAllRecipeData(filteredRecipes.data);

    // console.log("filteredRecipes.data:", filteredRecipes.data);
    // console.log("filteredRecipes.data.length:", filteredRecipes.data.length);

    if (filteredRecipes.data.length === 20) {
      handleNextButton(filteredRecipes.data);
    }
  };

  const handleClearFilters = async () => {
    console.log("Clearing filters...");
    queryPageNum = 0;
    setQueryButtons([]);
    setInputText("");
    setFilters([]);
  };

  const allRecipes = allRecipeData.map((el) => (
    <SearchRecipes recipe={el} key={el.recipeId} />
  ));

  const allQueryButtons = queryButtons.map((el) => (
    <SearchPageButton
      pageNum={el}
      key={el}
      setAllRecipeData={setAllRecipeData}
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

  // console.log("allRecipeData:", allRecipeData);
  // console.log("queryButtons:", queryButtons);

  return (
    <div>
      <h1>Search Page</h1>
      <form action="submit" onSubmit={handleSubmit}>
        <SearchPageInput inputText={inputText} setInputText={setInputText} />
        {allLabels}
        <button onClick={handleClearFilters}>Clear Filters</button>
      </form>
      <div>{allRecipes}</div>
      <div>{allQueryButtons}</div>
    </div>
  );
};

export default SearchPage;
