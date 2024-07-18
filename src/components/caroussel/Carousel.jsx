import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
} from "@heroicons/react/24/solid";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

//currentIndex starts at 0, meaning it will start showing from the first recipe
//the handlerPrevButton 's will update the carousel so it will show the previous and the next recipes depending in where the current index is

const RecipeCarousel = ({ type }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [detailedRecipes, setDetailedRecipes] = useState([]);
  const [header, setHeader] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(`/api/carousel/${type}`);
        const recipes = response.data.recipes;
        const adjustedHeader = response.data.header.replace(
          /(\s|\/)([a-z])/g,
          ($1) => $1.toUpperCase()
        );
        setHeader(adjustedHeader);

        const detailedRecipesPromises = recipes.map(async (recipe) => {
          const recipeDetails = await axios.get(
            `/api/recipes/${recipe.recipeId}`
          );
          console.log("recipeDetails:", recipeDetails);
          const detailedRecipe = {
            ...recipe,
            calories: recipeDetails.data.calories,
            dishType: recipeDetails.data.dishType,
            label: recipeDetails.data.label,
            mealType: recipeDetails.data.mealType,
            image: recipeDetails.data.image,
            sourceName: recipeDetails.data.sourceName,
            sourceUrl: recipeDetails.data.sourceUrl,
            averageScore: recipe.averageScore.toFixed(1), //format the rating to one decimal place
          };
          // console.log(detailedRecipe); // Log detailed recipe data
          return detailedRecipe;
        });

        const detailedRecipes = await Promise.all(detailedRecipesPromises);
        setDetailedRecipes(detailedRecipes);
        console.log("detailedRecipes:", detailedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };
    fetchRecipes();
  }, []);

  if (!detailedRecipes.length) return <p>Loading recipes...</p>;

  // const handlePrevButton = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === 0 ? detailedRecipes.length - 1 : prevIndex - 1
  //   );
  // };

  // const handleNextButton = () => {
  //   setCurrentIndex((prevIndex) =>
  //     prevIndex === detailedRecipes.length - 1 ? 0 : prevIndex + 1
  //   );
  // };

  const carouselDivs = detailedRecipes.map((el) => (
    <div
      className="flex flex-col h-full mx-7 text-primary-50"
      key={el.recipeId}
    >
      <div className="flex flex-row justify-center place-items-center gap-x-3 p-4 h-fit w-full bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 drop-shadow-[0px_15px_15px_rgba(0,0,0,0.5)]">
        <h2 className="h-full text-secondary-100 text-4xl font-bold drop-shadow-md">
          {el.label}
        </h2>
        <div className="flex flex-row place-items-center">
          <StarIcon className="h-8 w-8 text-secondary-400 " />
          {el.averageScore !== "0.0" && (
            <p className="text-xl text-secondary-100 ml-1">
              ({el.averageScore})
            </p>
          )}
          {el.averageScore === "0.0" && (
            <p className="text-xl text-secondary-100 ml-1">(Unrated)</p>
          )}
        </div>
      </div>
      <div className="flex flex-row px-12">
        <div className="w-1/3">
          <img className="w-full h-full" src={`${el.image}.jpg`} alt="Image" />
        </div>
        <div className="flex flex-col justify-center w-full gap-y-4">
          <div className="flex flex-col px-6 gap-y-4 text-lg">
            <p className="">Dish Type: {el.dishType}</p>
            <p className="">Meal Type: {el.mealType}</p>
            <p className="">Calories: {el.calories.toFixed(2)}</p>
          </div>
          <p>
            From {el.sourceName}: <a href={el.sourceUrl}>{el.sourceUrl}</a>
          </p>
        </div>
      </div>
    </div>
  ));

  return (
    // <div className="relative w-full max-w-6xl mx-auto mt-32 z-10">
    //   <h2 className="text-3xl text-center mb-8">Most Popular Recipes</h2>

    //   <div className="relative flex items-center justify-between">
    //     <button onClick={handlePrevButton}>
    //       <ChevronLeftIcon className="h-6 w-6" />
    //     </button>
    //     <div className="w-full overflow-hidden">
    //       <div className="flex">
    //         {detailedRecipes
    //           .slice(currentIndex, currentIndex + 4)
    //           .map((recipe, index) => (
    //             <div key={index} className="w-1/4 p-4 flex-shrink-0">
    //               <div className="p-4">
    //                 <img
    //                   src={`${recipe.image}.jpg`}
    //                   alt="recipe_image"
    //                   className="w-full h-auto rounded-sm shadow-lg"
    //                 />
    //                 <h3 className="text-lg font-medium text-center mt-4">
    //                   <Link
    //                     to={`/recipe-page/${recipe.recipeId}`}
    //                     state={recipe}
    //                   >
    //                     {recipe.label}
    //                   </Link>
    //                 </h3>
    //                 <div className="flex items-center justify-center mt-2">
    //                   <StarIcon className="h-5 w-5 text-secondary-400" />
    //                   <p className="text-xl ml-1">{recipe.averageScore}</p>
    //                 </div>
    //               </div>
    //             </div>
    //           ))}
    //       </div>
    //     </div>
    //     <button onClick={handleNextButton}>
    //       <ChevronRightIcon className="h-6 w-6" />
    //     </button>
    //   </div>
    // </div>
    <div className="flex flex-col place-items-center">
      <h2 className="text-3xl text-center mb-8">{header}</h2>
      <Carousel
        className="w-4/5 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 drop-shadow-lg shadow-lg"
        showArrows={true}
        showThumbs={false}
        showStatus={false}
        autoPlay={true}
        infiniteLoop={true}
        interval={8000}
      >
        {carouselDivs}
      </Carousel>
    </div>
  );
};

export default RecipeCarousel;
