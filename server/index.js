/////////////////////////////////////////////////////////////////////////////
//  Imports
/////////////////////////////////////////////////////////////////////////////
import express from "express";
import session from "express-session";
import morgan from "morgan";
import ViteExpress from "vite-express";
import config from "../config/config.js";
import "dotenv/config";
import handlerFunctions from "./controller.js";

/////////////////////////////////////////////////////////////////////////////
//  Express instance and Middleware
/////////////////////////////////////////////////////////////////////////////
const app = express();
const port = config.SERVER_PORT;
ViteExpress.config({ printViteDevServerHost: true });

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
  })
);

/////////////////////////////////////////////////////////////////////////////
//  Endpoints
/////////////////////////////////////////////////////////////////////////////
const {
  register,
  login,
  sessionCheck,
  logout,
  updateAccount,
  deleteAccount,
  addFavorite,
  getFavorites,
  removeFavorite,
  getAllFoods,
  getUserPantryFoods,
  addFoodToPantry,
  removeFoodFromPantry,
  getRecipesByUserPantry,
  getAllRecipes,
  getRecipeByRecipeId,
  getRecipeIngredientsByRecipeId,
  getRecipeLabelsByRecipeId,
  createNewRating,
  editRating,
  deleteRating,
  getRatingsByRecipeId,
  getRatingsByUserId,
  getAllLabels,
  highestRatedCaroussel,
  randomCaroussel,
} = handlerFunctions;

app.post("/api/register", register);
app.post("/api/login", login);
app.get("/api/session-check", sessionCheck);
app.post("/api/logout", logout);
app.put("/api/profile", updateAccount);
app.delete("/api/profile", deleteAccount);

app.post("/api/favorites", addFavorite);
app.get("/api/getFavorites", getFavorites);
app.delete("/api/favorites/:favoriteId", removeFavorite);

// pantry endpoints
app.get("/api/pantry/recipes/:id/:pageNum", getRecipesByUserPantry);
app.get("/api/pantry/foods/all", getAllFoods);
app.get("/api/pantry/foods/:id", getUserPantryFoods);
app.post("/api/pantry/add", addFoodToPantry);
app.delete("/api/pantry/delete/:id", removeFoodFromPantry);

app.post("/api/recipes/all/:pageNum", getAllRecipes);
app.get("/api/recipes/:id", getRecipeByRecipeId);

app.get("/api/recipes/ingredients/:id", getRecipeIngredientsByRecipeId);
app.get("/api/recipes/labels/:id", getRecipeLabelsByRecipeId);

// rating endpoints
app.post("/api/recipes/ratings/new", createNewRating);
app.put("/api/recipes/ratings/edit/:id", editRating);
app.delete("/api/recipes/ratings/delete/:id", deleteRating);
app.get("/api/recipes/ratings/:id", getRatingsByRecipeId);
app.get("/api/recipes/ratings/user/:id", getRatingsByUserId);

app.get("/api/labels/all", getAllLabels);

// caroussel endpoints
app.get("/api/caroussel/highest-rated", highestRatedCaroussel);
app.get("/api/caroussel/random", randomCaroussel);

/////////////////////////////////////////////////////////////////////////////
//  Config server on port
/////////////////////////////////////////////////////////////////////////////
ViteExpress.listen(app, port, () =>
  console.log(`Execute port ${port}! http://localhost:${port}`)
);
