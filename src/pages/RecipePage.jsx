import React, { useEffect } from "react";

const RecipePage = (recipeId) => {
  useEffect(async () => {
    const res = await axios.get(`/api/recipes/${recipeId}`);
  }, []);

  return <></>;
};

export default RecipePage;
