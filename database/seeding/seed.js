import db, {
    User,
    Favorite,
    Rating,
    Pantry,
    Food,
    Ingredient,
    Recipe,
    RecipeIngredient,
    Label,
    RecipeLabel,
  } from "../model.js";
import recipeData0 from "./recipeJSONs/all_recipes_0.json"
import recipeData1 from "./recipeJSONs/all_recipes_1.json"
import recipeData2 from "./recipeJSONs/all_recipes_2.json"

console.log('Syncing database...')
await db.sync({force: true})
console.log('Seeding database...')

