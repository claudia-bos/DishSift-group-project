import { useNavigate } from "react-router-dom";

/**
 *  A styled card component to show the recipe title and image.
 *
 *  @component
 *
 *  @param {object} props - the componet accepts props.
 *  @param {object} props.recipe - the recipe to include on the card.
 *  @param {boolean} [props.showMatchedIngredients=false] - pass true to show the matched
 *    ingredient numbers.
 *
 *  @returns {JSX.Element} the rendered recipe card.
 */
const RecipeCard = ({ recipe, showMatchedIngredients = false }) => {
  const navigate = useNavigate();

  return (
    <div
      className="group flex flex-col m-2 items-center justify-center drop-shadow-md rounded-xl transition-transform ease-in-out duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-primary-100  hover:cursor-pointer hover:shadow-inner hover:shadow-primary-500 hover:brightness-105 bg-gradient-to-tr from-neutral-100 to-neutral-200 hover:from-primary-800 hover:to-primary-1000 hover:text-primary-50"
      onClick={() => {
        navigate(`/recipe-page/${recipe.recipeId}`, {
          state: { recipe },
        });
      }}
    >
      <div className="flex w-full h-full rounded-t-xl drop-shadow-md overflow-clip">
        <img
          src={`${recipe.image}.jpg`}
          alt="recipe_image"
          className="w-full object-contain"
        />
      </div>
      <div className="w-full h-2/6 rounded-b-xl px-2">
        <div className="w-full text-md font-medium">
          <div className="flex flex-col items-center justify-center h-[48px] md:h-[76px] text-center w-full drop-shadow-md text-primary-800 group-hover:text-primary-0">
            {recipe.label}
          </div>
        </div>
        {showMatchedIngredients && (
          <div className="w-full h-1/6 text-center text-xs pb-4">
            Ingredients matched: {recipe.foodCount}/{recipe.totalIngredients}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
