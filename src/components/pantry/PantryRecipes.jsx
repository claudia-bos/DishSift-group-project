import { useNavigate } from "react-router-dom";

const PantryRecipes = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div>
      <p
        onClick={() => {
          navigate(`/recipe-page/${recipe.recipeId}`, {
            state: { recipe },
          });
        }}
      >
        {recipe.label}
      </p>
      <img src={`${recipe.image}.jpg`} alt="recipe_image" />
      <p>
        Ingredients matched: {recipe.foodCount}/{recipe.totalIngredients}
      </p>
    </div>
  );
};

export default PantryRecipes;
