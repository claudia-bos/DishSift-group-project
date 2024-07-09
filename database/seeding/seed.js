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
import recipeData3 from "./recipeJSONs/all_recipes_3.json" assert { type: "json" }
import recipeData4 from "./recipeJSONs/all_recipes_4.json" assert { type: "json" }
import recipeData5 from "./recipeJSONs/all_recipes_5.json" assert { type: "json" }
import recipeData6 from "./recipeJSONs/all_recipes_6.json" assert { type: "json" }
import recipeData7 from "./recipeJSONs/all_recipes_7.json" assert { type: "json" }
import recipeData8 from "./recipeJSONs/all_recipes_8.json" assert { type: "json" }
import recipeData9 from "./recipeJSONs/all_recipes_9.json" assert { type: "json" }
import recipeData10 from "./recipeJSONs/all_recipes_10.json" assert { type: "json" }
import recipeData11 from "./recipeJSONs/all_recipes_11.json" assert { type: "json" }
import recipeData12 from "./recipeJSONs/all_recipes_12.json" assert { type: "json" }
import recipeData13 from "./recipeJSONs/all_recipes_13.json" assert { type: "json" }
import recipeData14 from "./recipeJSONs/all_recipes_14.json" assert { type: "json" }
import recipeData15 from "./recipeJSONs/all_recipes_15.json" assert { type: "json" }
import recipeData16 from "./recipeJSONs/all_recipes_16.json" assert { type: "json" }
import recipeData17 from "./recipeJSONs/all_recipes_17.json" assert { type: "json" }
import recipeData18 from "./recipeJSONs/all_recipes_18.json" assert { type: "json" }
import recipeData19 from "./recipeJSONs/all_recipes_19.json" assert { type: "json" }
import recipeData20 from "./recipeJSONs/all_recipes_20.json" assert { type: "json" }
import recipeData21 from "./recipeJSONs/all_recipes_21.json" assert { type: "json" }
import recipeData22 from "./recipeJSONs/all_recipes_22.json" assert { type: "json" }
import recipeData23 from "./recipeJSONs/all_recipes_23.json" assert { type: "json" }
import recipeData24 from "./recipeJSONs/all_recipes_24.json" assert { type: "json" }
import userData from "./tableJSONs/users.json" assert { type: "json" }
import favoriteData from "./tableJSONs/favorites.json" assert { type: "json" }
import ratingData from "./tableJSONs/ratings.json" assert { type: "json" }
import pantryData from "./tableJSONs/pantries.json" assert { type: "json" }


console.log('Syncing database...')
await db.sync({force: true})
console.log('Seeding database...')

// multidimensional array so that we can seed one array at a time 
// and avoid any timeouts when seeding the recipes table
const allRecipes = [
        recipeData0,
        recipeData1,
        recipeData2,
        recipeData3,
        recipeData4,
        recipeData5,
        recipeData6,
        recipeData7,
        recipeData8,
        recipeData9,
        recipeData10,
        recipeData11,
        recipeData12,
        recipeData13,
        recipeData14,
        recipeData15,
        recipeData16,
        recipeData17,
        recipeData18,
        recipeData19,
        recipeData20,
        recipeData21,
        recipeData22,
        recipeData23,
        recipeData24
    ]

const seedDataBase = async () => {
    
    for (let i = 0; i < allRecipes.length; i++) {
        const recipesInDB = await Promise.all(allRecipes[i].map(async (el) => {
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
            
            // spread dietLabels and healthLabels into a single array
            // and create labels table and recipe labels table
            const allLabels = [...dietLabels, ...healthLabels]
            const labelsInDB = allLabels.map(async (el) => {
                const newLabel = await Label.findOrCreate({
                    where: { labelName: el }
                })
                const newRecipeLabel = await RecipeLabel.create({
                    recipeId: newRecipe.recipeId,
                    labelId: newLabel[0].labelId
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
    }

    // create user table
    const usersInDB = await Promise.all(userData.map(async (el) => {
        console.log('Users seeding...')
        const newUser = await User.create({
            username: el.username,
            password: el.password
        })
        console.log('Users done seeding!')
        return newUser
    }))

    // create pantries table
    const pantriesInDB = await Promise.all(pantryData.map(async (el) => {
        console.log('Pantry seeding...')
        const newPantry = await Pantry.create({
            userId: el.userId,
            foodId: el.foodId
        })
        console.log('Pantry done seeding!')
        return newPantry
    }))
    
    // create favorites table
    const favoritesInDB = await Promise.all(favoriteData.map(async (el) => {
        console.log('Favorites seeding...')
        const newFavorite = await Favorite.create({
            userId: el.userId,
            recipeId: el.recipeId
        })
        console.log('Favorites done seeding!')
        return newFavorite
    }))

    // create ratings table
    const ratingsInDB = await Promise.all(ratingData.map(async (el) => {
        console.log('Ratings seeding...')
        const newRating = await Rating.create({
            userId: el.userId,
            recipeId: el.recipeId,
            comment: el.comment,
            score: el.score
        })
        console.log('Ratings done seeding!')
    }))

    console.log('Successfully seeded database!')
}

seedDataBase();

// await db.close()