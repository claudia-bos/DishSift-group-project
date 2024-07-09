import React, { useState }from 'react';
import IngredientForm from '../components/ingredientform/IngredientForm';
import axios from 'axios';

// TODO: Update with the correct API , it might need other changes in order to make it work
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
        setShowResults(true); // Show results after fetching recipes
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
                                <div key={recipe.recipeId}>
                                    <h3>{recipe.label}</h3>
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