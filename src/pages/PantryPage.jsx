import React, { useState, useEffect }from 'react';
import IngredientForm from '../components/ingredientform/IngredientForm';
import axios from 'axios';


// TODO: Update the pantry recipe endpoint to fetch the data correctly in the pantrypage
const PantryPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [userId, setUserId] = useState(null);



    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await axios.get('/api/session-check');
                if (response.data.success) {
                    setUserId(response.data.userId);
                } else {
                    // Redirect to login if no user is logged in
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error checking session:', error);
            }
        };

        fetchUserId();
    }, []);


   const handleGenerateRecipes = async (ingredients) => {
        if (!userId) return;

        try {
            const response = await axios.get(`/api/pantry/recipes/{userId}`, {
                params: {
                    ingredients: ingredients.join(','),
                },
            });
            setRecipes(response.data);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
        setShowResults(true);
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
                                    <h3>{recipe.smallImage}</h3>
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