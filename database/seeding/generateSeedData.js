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
// const count = firstRecipeData.count;
const count = 600;

let writeStream = createWriteStream(`./database/seeding/recipeJSONs/all_recipes${iterations}.json`);
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
  console.log("nextUrl:", nextUrl);

  if (iterations % 10 === 0) {
    writeStream = createWriteStream(`./database/seeding/recipeJSONs/all_recipes${iterations / 10}.json`)
    jsonStream.pipe(writeStream)
  }

  // time delay here
  setTimeout(() => populateJSON(res.data), 6667);
};

populateJSON(firstRecipeData);