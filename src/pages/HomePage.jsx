import React, { useEffect, useState } from "react";
import axios from "axios";
import Carousel from "../components/caroussel/Carousel.jsx";

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
    <div className="min-h-screen pt-16 px-4 pb-4">
      <Carousel recipes={recipes} />
    </div>
  );
};

export default HomePage;
