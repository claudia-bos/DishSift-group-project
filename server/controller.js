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
} from "../database/model.js";
import { Sequelize } from "sequelize";

const handlerFunctions = {
  /**
   * A POST endpoint to register a new user. Will create the user
   *   if the given username doesn't already exist in the database.
   *   If the username is already in the database, will not add to
   *   database and will respond with an appropriate message.
   */
  register: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Register:", req.body);

      if (await User.findOne({ where: { username: username } })) {
        const alreadyExistsMessage = `Username '${username}', already exists`;
        console.log(alreadyExistsMessage);
        res.send({
          message: alreadyExistsMessage,
          success: false,
        });
        return;
      }

      const createdMessage = `Created user ${username}`;
      console.log(createdMessage);
      const newUser = await User.create({
        username: username,
        password: password,
      });

      req.session.userId = newUser.userId;

      res.send({
        message: createdMessage,
        success: true,
        userId: newUser.userId,
      });
    } catch (error) {
      console.log("Registration failed:", error);
      res.status(500).send({
        message: "Registration failed",
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * A POST endpoint to login a user.
   */
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        const userNotFoundMessage = `User '${username}' not found`;
        console.log(userNotFoundMessage);
        return res.status(200).send({
          message: userNotFoundMessage,
          success: false,
        });
      }

      console.log(`User '${username}' found`);

      // Check that password in DB matches the given one
      const isMatch = user.password === password;

      if (!isMatch) {
        const wrongPasswordMessage = `Wrong password for user '${username}'`;
        console.log(wrongPasswordMessage);
        return res.status(200).send({
          message: wrongPasswordMessage,
          success: false,
        });
      }

      // Login success so set session value for user
      req.session.user = {
        userId: user.userId,
        username: user.username,
      };

      const loginSuccessMessage = `Login successful for user '${username}'`;
      console.log(loginSuccessMessage);
      res.status(200).send({
        message: loginSuccessMessage,
        success: true,
        user: req.session.user,
      });
    } catch (error) {
      console.log("Login failed:", error);
      res.status(500).send({
        message: "Login failed",
        success: false,
        error: error.message,
      });
    }
  },

  sessionCheck: async (req, res) => {
    if (req.session.user) {
      res.send({
        message: "User is still logged in",
        success: true,
        userId: req.session.user.userId,
      });
    } else {
      res.send({
        message: "No user logged in",
        success: false,
      });
    }
  },

  logout: async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          message: "Logout failed",
          success: false,
        });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({
        message: "Logout successful",
        success: true,
      });
    });
  },

  ///////////////////////////////////////
  //updating and deleting user's account//
  ///////////////////////////////////////

  updateAccount: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findByPk(req.session.user.userId);

      if (user) {
        if (username) user.username = username;
        if (password) user.password = password;

        await user.save();
        res.json({ message: "Profile updated successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const user = await User.findByPk(req.session.user.userId);

      if (user) {
        await user.destroy();
        res.json({ message: "Account deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  //////////////////////////////////////////////
  //functions to handle user's favorite recipes//
  //////////////////////////////////////////////

  addFavorite: async (req, res) => {
    const { userId, recipeId } = req.body;
    try {
      const favorite = await Favorite.create({ userId, recipeId });
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ message: "Error adding favorites", error });
    }
  },

  getFavorites: async (req, res) => {
    if (!req.session.user) {
      return res.status(401).send({
        message: "No user in session",
        success: false,
      });
    }

    try {
      const favorites = await Favorite.findAll({
        where: { userId: req.session.user.userId },
        include: { model: Recipe },
      });
      res.status(200).json({
        message: "User favorites found",
        success: true,
        favorites: favorites,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching favorites", error });
    }
  },

  removeFavorite: async (req, res) => {
    const { favoriteId } = req.params;
    try {
      const favorite = await Favorite.findOne({ where: { id: favoriteId } });

      if (!favorite) {
        return res.status(404).json({
          message: "Favorite not found",
          success: false,
        });
      }

      await favorite.destroy();
      res.status(200).json({
        message: "Favorite removed successfully",
        success: true,
      });
    } catch (error) {
      res.status(500).json({ message: "Error removing favorite", error });
    }
  },

  // create rating
  createNewRating: async (req, res) => {
    const { userId, recipeId, comment, score } = req.body;

    const newRating = await Rating.create({
      userId: userId,
      recipeId: recipeId,
      comment: comment,
      score: score,
    });

    res.status(200).send(newRating);
  },

  // edit rating
  editRating: async (req, res) => {
    const { id } = req.params;
    const { comment, score } = req.body;

    const ratingToEdit = await Rating.findByPk(id);

    ratingToEdit.comment = comment;
    ratingToEdit.score = score;

    await ratingToEdit.save();

    res.status(200).send(ratingToEdit);
  },

  // delete rating
  deleteRating: async (req, res) => {
    const { id } = req.params;

    await Rating.destroy({
      where: { ratingId: id },
    });

    res.status(200).send("Rating has been deleted");
  },

  // get recipe ratings
  getRatingsByRecipeId: async (req, res) => {
    const { id } = req.params;

    const recipeRatings = await Rating.findAll({
      where: { recipeId: id },
    });

    res.status(200).send(recipeRatings);
  },

  // get user's ratings
  getRatingsByUserId: async (req, res) => {
    const { id } = req.params;

    const userRatings = await Rating.findAll({
      where: { userId: id },
    });

    res.status(200).send(userRatings);
  },

  // get all foods
  getAllFoods: async (req, res) => {
    const allFoods = await Food.findAll();

    // console.log("allFoods:", allFoods);

    res.status(200).send(allFoods);
  },

  // get user pantry items
  getUserPantryFoods: async (req, res) => {
    const { id } = req.params;
    console.log("id:", id);

    const userPantryFoods = await Food.findAll({
      include: [
        {
          model: Pantry,
          where: { userId: id },
          attributes: [],
        },
      ],
    });

    res.status(200).send(userPantryFoods);
  },

  // add to pantry
  addFoodToPantry: async (req, res) => {
    const { userId, foodId } = req.body;

    const newPantryFood = await Pantry.create({ userId, foodId });

    res.status(200).send(newPantryFood);
  },

  // remove from pantry
  removeFoodFromPantry: async (req, res) => {
    const { id } = req.params;

    console.log("foodId:", id);

    await Pantry.destroy({
      where: { foodId: id },
    });

    res.status(200).send("Successfully removed food");
  },

  // get recipes by user pantry items
  getRecipesByUserPantry: async (req, res) => {
    const { id, pageNum } = req.params;

    console.log("id:", id);
    console.log("pageNum:", pageNum);
    console.log("offset:", pageNum * 20);

    const pantryRecipes = await Recipe.findAll({
      offset: pageNum * 20, // pageNum == 0 ? 0 : pageNum * 20 + 1,
      limit: 20, // pageNum == 0 ? 21 : 20,
      order: [["recipeId", "ASC"]],
      // separate: true,
      include: [
        {
          model: RecipeIngredient,
          required: true,
          attributes: ["recipeId"],
          // separate: true,
          include: [
            {
              model: Ingredient,
              required: true,
              attributes: ["foodId"],
              include: [
                {
                  model: Food,
                  required: true,
                  attributes: ["foodId"],
                  include: [
                    {
                      model: Pantry,
                      where: { userId: id },
                      attributes: ["foodId"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      subQuery: false,
      distinct: true,
    });

    console.log("pantryRecipes:", pantryRecipes.length);

    pantryRecipes.forEach((el) => console.log(el.recipeId));

    res.status(200).send(pantryRecipes);
  },

  // get all recipes
  getAllRecipes: async (req, res) => {
    const { pageNum } = req.params;
    const allRecipes = await Recipe.findAll({
      offset: pageNum * 20,
      limit: 20,
      order: [["recipeId", "ASC"]],
    });

    // console.log('allRecipes:', allRecipes)

    res.status(200).send(allRecipes);
  },

  // get recipe by recipe id
  getRecipeByRecipeId: async (req, res) => {
    const { id } = req.params;
    const recipe = await Recipe.findByPk(id);

    res.status(200).send(recipe);
  },

  // get recipe ingredients by recipe id
  getRecipeIngredientsByRecipeId: async (req, res) => {
    const { id } = req.params;

    const recipeIngredients = await Ingredient.findAll({
      include: [
        {
          model: RecipeIngredient,
          where: { recipeId: id },
          attributes: ["recipeId"],
        },
      ],
    });

    res.status(200).send(recipeIngredients);
  },

  // get recipe labels by recipe id
  getRecipeLabelsByRecipeId: async (req, res) => {
    const { id } = req.params;

    console.log("id:", id);

    const recipeLabels = await Label.findAll({
      include: [
        {
          model: RecipeLabel,
          where: { recipeId: id },
          attributes: [],
        },
      ],
    });

    console.log("recipeLabels:", recipeLabels);

    res.status(200).send(recipeLabels);
  },

  // recipe caroussels
  highestRatedCaroussel: async (req, res) => {
    const highestRatedRecipeIds = await Rating.findAll({
      attributes: [
        "recipeId",
        [Sequelize.fn("AVG", Sequelize.col("score")), "averageScore"],
      ],
      order: [["averageScore", "DESC"]],
      group: ["recipeId"],
      limit: 5,
    });
    res.status(200).send(highestRatedRecipeIds);
  },
};

export default handlerFunctions;
