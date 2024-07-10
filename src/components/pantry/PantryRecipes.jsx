const PantryRecipes = ({ recipe }) => {
  //   console.log("recipe:", recipe);
  return (
    <div>
      <p>{recipe.label}</p>
      <img src={recipe.smallImage} alt="image" />
    </div>
  );
};

export default PantryRecipes;
