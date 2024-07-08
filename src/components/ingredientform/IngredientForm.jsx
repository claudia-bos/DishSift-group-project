import React, { useState } from 'react'

const IngredientForm = ({ onGenerateRecipes }) => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    //hardcoded array of essencial ingredients name
    const ingredients = [
      'Butter', 'Egg', 'Garlic', 'Milk', 'Onion', 'Sugar', 
      'Flour', 'Olive Oil', 'Garlic Powder', 'White Rice', 
      'Cinnamon', 'salmon', 'Soy Sauce', 'Mayonnaise',
      'Vegetable Oil', 'Carrot', 'bread', 'Tomato', 
      'Potato', 'Red Onion', 'Celery', 'Jalapeno', 
      'Avocado', 'Zucchini', 'paprika', 'Cherry Tomato',
      'bell pepper', 'spaghetti', 'cheddar', 'parmesan',
      'italian seasoning', 'chicken breast', 'chili powder',
      'basil', 'oregano', 'parsley', 'cumin', 'fish', 'ground beef',
      'peanut butter', 'honey', 'bacon','beef steak', 'tuna'
    ];

     
    //function that toggles the selection of ingredients
    const handleIngredientToggle = (ingredient) => {
      if (selectedIngredients.includes(ingredient)){
        setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
      } else {
        setSelectedIngredients([...selectedIngredients, ingredient])
      }
    };

    //Function that handles the onGenerateRecipes property with the actual list of selected ingredients
    const handleGenerateClick = () => {
      onGenerateRecipes(selectedIngredients);
    };


  return (

    <div>
      <h2>Pantry Essentials</h2>
      <div>
        {ingredients.map((ingredient) => (

          <div key={ ingredient }>
            <input
            type='checkbox'
            id={ingredient}
            name={ingredient}
            value={ingredient}
            onChange={() => handleIngredientToggle(ingredient)} 
            />
            <label htmlFor={ingredient}>{ingredient}</label>
          </div>       
        ))}
      </div>
      <button onClick={handleGenerateClick}>Generate Recipes</button>
    </div>
  )
};

export default IngredientForm