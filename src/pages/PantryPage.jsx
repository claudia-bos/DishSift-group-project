import React, { useState }from 'react';
import IngredientForm from '../components/ingredientform/IngredientForm';
import axios from 'axios';


// TODO: Update the pantry recipe endpoint to fetch the data correctly in the pantrypage
const PantryPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [showResults, setShowResults] = useState(false);

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
        setShowResults(true); //this will show results after fetching recipes
    };


    return (
        <div>
            <IngredientForm onGenerateRecipes={handleGenerateRecipes} />
            {showResults && (
                <div>
                    {recipes.length > 0 ? (
                        <div>
                            <h2>You can make this Recipes</h2>
                            {recipes.map((recipe) => (
                                <div key={recipe.id}>
                                    <h3>{recipe.title}</h3>
                                    <p>{recipe.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No recipes found. Select ingredients and click "Generate Recipes"</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default PantryPage