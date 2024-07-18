import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeCarousel from "../components/caroussel/Carousel.jsx";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);

  // console.log(recipes);

  useEffect(() => {
    const fecthRandomRecipes = async () => {
      try {
        const response = await axios.get("/api/caroussel/highest-rated");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes", error);
      }
    };
    fecthRandomRecipes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen p-4 pt-28 gap-y-8">
      <RecipeCarousel type={"highest-rated"} />
      <RecipeCarousel type={"random"} />
    </div>
  );
};

export default HomePage;
