import React, { useState, useEffect } from "react";
import axios from "axios";
// import { query } from "express";
import SearchRecipes from "../components/search/SearchRecipes.jsx";
import SearchPageButton from "../components/search/SearchPageButton.jsx";
import { Recipe } from "../../database/model.js";

const SearchPage = () => {
  const [allRecipeData, setAllRecipeData] = useState([]);
  // const [queryPageNum, setQueryPageNum] = useState(0);
  const [queryButtons, setQueryButtons] = useState([]);

  let queryPageNum = 0;
  const test = [];

  useEffect(() => {
    axios.get(`/api/recipes/all/${queryPageNum}`).then((res) => {
      setAllRecipeData(res.data);
      // if (res.data.length === 20) {
      //   handleNextButton(res.data);
      // }
    });
  }, []);

  useEffect(() => {
    if (allRecipeData.length === 20) {
      handleNextButton(allRecipeData);
    }
  }, []);

  const handleNextButton = async (thisQuery) => {
    console.log("You made it to the function");
    console.log("thisQQuery: ", thisQuery);
    if (thisQuery.length === 20) {
      test.push(queryPageNum);
      console.log("test:", test);
      // setQueryButtons([...test]);
      queryPageNum++;
      console.log("queryPageNum:", queryPageNum);
      const nextQuery = await axios.get(`/api/recipes/all/${queryPageNum}`);
      console.log("nextQuery.data:", nextQuery.data);
      handleNextButton(nextQuery.data);
    } else {
      setQueryButtons([...test]);
      return console.log("Function should have stopped by now");
    }
  };

  const allRecipes = allRecipeData.map((el) => (
    <SearchRecipes recipe={el} key={el.recipeId} />
  ));

  const allQueryButtons = queryButtons.map((el) => (
    <SearchPageButton pageNum={el} setAllRecipeData={setAllRecipeData} />
  ));

  // console.log("allRecipeData:", allRecipeData);
  console.log("queryButtons:", queryButtons);

  return (
    <div>
      <h1>Search Page</h1>
      {allRecipes}
      {allQueryButtons}
    </div>
  );
};

export default SearchPage;
