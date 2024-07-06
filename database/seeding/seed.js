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
import recipeData0 from "./recipeJSONs/all_recipes_0.json" assert { type: "json" }
import recipeData1 from "./recipeJSONs/all_recipes_1.json" assert { type: "json" }
import recipeData2 from "./recipeJSONs/all_recipes_2.json" assert { type: "json" }
import userData from "./tableJSONs/users.json" assert { type: "json" }
import favoriteData from "./tableJSONs/favorites.json" assert { type: "json" }
import ratingData from "./tableJSONs/ratings.json" assert { type: "json" }
import pantryData from "./tableJSONs/pantries.json" assert { type: "json" }

console.log('Syncing database...')
await db.sync({force: true})
console.log('Seeding database...')

// spread all recipes into a single array
const allRecipes = [...recipeData0, ...recipeData1, ...recipeData2]

const seedDataBase = async () => {
    


        const recipesInDB = await Promise.all(allRecipes.map(async (el) => {
            let { label, images, source, url, dietLabels, healthLabels, ingredients, calories, totalWeight, totalTime, mealType, dishType } = el.recipe
            const recipeYield = el.recipe.yield
            const thumbnailImage = images.THUMBNAIL.url
            const smallImage = images.SMALL.url
            const regularImage = images.REGULAR.url
            const largeImage = images?.LARGE?.url ?? null
            mealType = mealType[0]
            dishType = dishType?.[0] ?? null
            
            const newRecipe = await Recipe.create({
                label: label,
                thumbnailImage: thumbnailImage,
                smallImage: smallImage,
                regularImage: regularImage,
                largeImage: largeImage,
                sourceName: source,
                sourceUrl: url,
                yield: recipeYield,
                calories: calories,
                totalWeight: totalWeight,
                totalTime: totalTime,
                mealType: mealType,
                dishType: dishType
            })
        
            // combine and map over labels
            const allLabels = [...dietLabels, ...healthLabels]
            const labelsInDB = allLabels.map(async (el) => {
                const newLabel = await Label.findOrCreate({
                    where: { labelName: el }
                })
        
                const newRecipeLabel = await RecipeLabel.create({
                    recipeId: newRecipe.recipeId,
                    labelId: newLabel.labelId
                })
            })
        
            // create food and ingredient related tables
            const foodsInDB = ingredients.map(async (el) => {
                const foodName = el.food.replace(/-/gi, " ").toLowerCase()
                const newFood = await Food.findOrCreate({
                    where: { foodName: foodName },
                    defaults: {
                        foodCategory: el.foodCategory,
                        image: el.image
                    }
                })
        
                const newIngredient = await Ingredient.create({
                    text: el.text,
                    quantity: el.quantity,
                    measure: el.measure,
                    weight: el.weight,
                    foodId: newFood[0].foodId
                })
        
                const newRecipeIngredient = await RecipeIngredient.create({
                    ingredientId: newIngredient.ingredientId,
                    recipeId: newRecipe.recipeId
                })
            }) 
        })
    )

    // create user table
    const usersInDB = await Promise.all(userData.map(async (el) => {
        console.log('user seeding')
        const newUser = await User.create({
            username: el.username,
            password: el.password
        })
        console.log('user done seeding')
        return newUser
    }))

    // create user table
        // create pantries table
        const pantriesInDB = await Promise.all(pantryData.map(async (el) => {
            console.log('pantry seeding')
            const newPantry = await Pantry.create({
                userId: el.userId,
                foodId: el.foodId
            })
            console.log('pantry done seeding')
            return newPantry
        }))
}

seedDataBase();

// await db.close()