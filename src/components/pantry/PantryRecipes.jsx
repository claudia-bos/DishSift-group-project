import { useNavigate } from "react-router-dom";

const PantryRecipes = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col m-1 items-center justify-center drop-shadow-md h-fit rounded-lg bg-neutral-100 hover:bg-primary-50  hover:cursor-pointer hover:shadow-inner hover:shadow-primary-200 hover:brightness-105"
      onClick={() => {
        navigate(`/recipe-page/${recipe.recipeId}`, {
          state: { recipe },
        });
      }}
    >
      <div className="w-full h-4/6">
        <img
          src={`${recipe.image}.jpg`}
          alt="recipe_image"
          className="w-full rounded-t-lg drop-shadow-md"
        />
      </div>
      <div className="w-full rounded-b-lg p-2">
        <div className="w-full h-1/6 text-lg font-medium">
          <div className="flex flex-col items-center justify-center h-[48px] md:h-[76px] text-center w-full">
            {recipe.label}
          </div>
        </div>
        <div className="w-full h-1/6 text-center">
          Ingredients matched: {recipe.foodCount}/{recipe.totalIngredients}
        </div>
      </div>
    </div>
  );
};

export default PantryRecipes;
