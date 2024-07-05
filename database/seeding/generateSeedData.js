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
import firstRecipeData from "./edaman_get_recipes_v2_no_query.json" assert { type: "json" };
import { writeFile } from "fs/promises";
import { createWriteStream } from "fs";
import JSONStream from "JSONStream";
import axios from "axios";

// array to collect all recipes
const allRecipes = [];

let iterations = 0;

// total number of recipes
const count = firstRecipeData.count;

const writeStream = createWriteStream("./database/seeding/all_recipes.json");
const jsonStream = JSONStream.stringify();
jsonStream.pipe(writeStream);

const populateJSON = async (currentRecipeBatch) => {
  console.log("currentRecipeBatch.to: ", currentRecipeBatch.to);
  if (currentRecipeBatch.to >= count) {
    // const seedData = JSON.stringify(allRecipes, null, 2);
    // try {
    //   await writeFile("./database/seeding/all_recipes.json", seedData);
    //   console.log("File has been written successfully");
    //   return;
    // } catch (err) {
    //   console.log("Error writing file:", err);
    //   return;
    // }

    jsonStream.end();

    writeStream.on("finish", () => {
      console.log("Large JSON file has been written successfully.");
    });

    writeStream.on("error", (err) => {
      console.error("Error writing large JSON file:", err);
    });
    console.log("All done!");
    return;
  }

  iterations++;
  console.log("iterations:", iterations);
  currentRecipeBatch.hits.map((el) => {
    allRecipes.push(el);
  });

  allRecipes.forEach((recipe) => {
    jsonStream.write(recipe);
  });

  const nextUrl = currentRecipeBatch._links.next.href;
  const res = await axios.get(nextUrl, {
    params: {
      app_id: process.env.EDAMAM_APP_ID,
      app_key: process.env.EDAMAM_APP_KEY,
      type: "public",
      ingr: 1 - 100,
    },
  });
  console.log("currentRecipeBatch:", currentRecipeBatch);

  // time delay here
  setTimeout(() => populateJSON(res.data), 6667);
};

populateJSON(firstRecipeData);

// const jsonTest = {key1: "hello there"}
// const jsonTest2 = {key2: "general kenobi"}

// const stringifyTest = JSON.stringify(jsonTest, null, 2)
// const stringifyTest2 = JSON.stringify(jsonTest2, null, 2)

// async function writeJsonToFile() {
//     try {
//         await writeFile('./database/seeding/output.json', stringifyTest);
//         console.log('File has been written successfully.');
//     } catch (err) {
//         console.error('Error writing file:', err);
//     }
// }

// writeJsonToFile()

// async function writeJsonToFile2() {
//     try {
//         await writeFile('./database/seeding/output.json', stringifyTest2);
//         console.log('File has been written successfully.');
//     } catch (err) {
//         console.error('Error writing file:', err);
//     }
// }

// writeJsonToFile2()

// const testData = 'https://api.edamam.com/api/recipes/v2?ingr=1-100&app_key=c46c2f8971618f73e9b50f94442acfa7&_cont=CHcVQBtNNQphDmgVQntAEX4BY0t7BgcCRGZFCmIRZFx6AwEAUXlSBmcQZFxxBAQBFjRDBzRBMFwmDAUBRWBGUWEbMAR7VgUVLnlSVSBMPkd5BgNK&type=public&app_id=3632ea2f'

// const getRecipeData = async () => {
//     const res = await axios.get(testData, {
//         params: {
//            app_id: process.env.EDAMAM_APP_ID,
//            app_key: process.env.EDAMAM_APP_KEY,
//            type: "public",
//            ingr: 1-100
//         }
//     })

//     console.log('res.data:', res.data)
// }

// getRecipeData()

// console.log('testData:', testData)
