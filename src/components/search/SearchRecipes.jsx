import { useNavigate } from "react-router-dom";

const SearchRecipes = ({ recipe }) => {
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
      <img src={recipe.image} alt="image" />
    </div>
  );
};

export default SearchRecipes;
