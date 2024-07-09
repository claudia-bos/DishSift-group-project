import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Carousel from '../components/caroussel/Carousel.jsx'


// TODO: update the recipe endpoint to fetch the recipe data for the caroussel
const HomePage = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fecthRandomRecipes = async () => {
      try {
        const response = await axios.get('/api/recipes');
        setRecipes(response.data.recipes);      
      } catch (error) {
        console.error('Error fetching recipes', error)
      }
    };
    fecthRandomRecipes();
  }, []);




  return (
    <div>
      <h2>Most Popular Recipes</h2>
      <Carousel recipes={recipes} />  
    </div>
  )
}

export default HomePage
