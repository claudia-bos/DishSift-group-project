import React, { useState }from 'react';
import IngredientForm from '../components/ingredientform/IngredientForm';
import axios from 'axios';


const PantryPage = () => {
    const [recipes, setRecipes] = useState([]);

    const handleGenerateRecipes = async (ingredients) => {
        try {
            const response = await axios.get('http://www.edamam.com', {
                params: {
                     ingredients: ingredients.join(',')   
                }
            });
            setRecipes(response.data.recipes);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };


  return (

    <div>
        <IngredientForm onGenerateRecipes={handleGenerateRecipes} />
        <h2>You can make this Recipes</h2>
        <div>
            {recipes.length > 0 ? (
                recipes.map((recipe) => (
                    <div key={recipe.id}>
                        <h3>{recipe.title}</h3>
                        <p>{recipe.description}</p>
                    </div>
                ))
            ) : (  
                <p>No recipes found. Select ingredients and click "Generate Recipes"</p>     
            )}
        </div>
    </div>
  );
};

export default PantryPage