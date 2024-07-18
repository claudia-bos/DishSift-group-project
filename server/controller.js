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
import { Sequelize, QueryTypes, Op } from "sequelize";
import _lodash from "lodash";

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

      req.session.user = {
        userId: newUser.userId,
        username: newUser.username,
      };

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
    try {
      const { username, password } = req.body;

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
        user: req.session.user,
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
      const { password } = req.body;
      const user = await User.findByPk(req.session.user.userId);

      if (user && user.password === password) {
        await user.destroy();
        req.session.destroy((err) => {
          if (err) {
            console.log("Session destruction error:", err);
            return res.status(500).json({
              message: "Logout failed",
              success: false,
            });
          }
          res.clearCookie("connect.sid");
          res.status(200).json({
            message: "Account deleted and logged out successfully",
            success: true,
          });
        });
      } else {
        res.status(400).json({ error: "Invalid password" });
      }
    } catch (error) {
      console.log("Error deleting account:", error);
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
    console.log(`Attempting to remove with ID: ${favoriteId}`);
    try {
      const favorite = await Favorite.findOne({
        where: { favoriteId: favoriteId },
      });

      if (!favorite) {
        console.log(`Favorite with ID ${favoriteId} not found`);
        return res.status(404).json({
          message: "Favorite not found",
          success: false,
        });
      }

      await favorite.destroy();
      console.log(`Favorite with ID ${favoriteId} removed successfully`);
      res.status(200).json({
        message: "Favorite removed successfully",
        success: true,
      });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Error removing favorite", error });
    }
  },

  // create rating
  createNewRating: async (req, res) => {
    const { recipeId, score, comment } = req.body;
    const userId = req.session.user.userId; // assuming the session contains user information

    try {
      const newRating = await Rating.create({
        userId: userId,
        recipeId: recipeId,
        comment: comment,
        score: score,
      });

      res.status(200).send(newRating);
    } catch (error) {
      res.status(500).json({ message: "Error submitting review", error });
    }
  },

  // edit rating
  editRating: async (req, res) => {
    const { id } = req.params;
    const { comment, score } = req.body;

    try {
      const ratingToEdit = await Rating.findByPk(id);

      if (!ratingToEdit) {
        return res.status(404).json({ message: "Rating not found" });
      }

      ratingToEdit.comment = comment;
      ratingToEdit.score = score;

      await ratingToEdit.save();

      res.status(200).send(ratingToEdit);
    } catch (error) {
      res.status(500).json({ message: "Error editing rating", error });
    }
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
      include: {
        model: User, // Include the user data
        attributes: ["username", "userId"], // Fetch only the username
      },
    });

    res.status(200).send(recipeRatings);
  },

  // get user's ratings
  getRatingsByUserId: async (req, res) => {
    const { id } = req.params;

    const recipeRatings = await Rating.findAll({
      where: { recipeId: id },
      include: {
        model: User, // Include the user data
        attributes: ["username"], // Fetch only the username
      },
    });

    res.status(200).send(recipeRatings);
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
    try {
      const { id, pageNum } = req.params;

      console.log("id:", id);
      console.log("pageNum:", pageNum);

      const pageSize = 20;
      const offset = pageNum * pageSize;

      // Query to get the total count of matched recipes
      const countQuery = `
        SELECT 
          COUNT(DISTINCT r."recipe_id") AS "totalMatchedRecipes"
        FROM 
          "recipes" r
          JOIN "recipe_ingredients" ri ON r."recipe_id" = ri."recipe_id"
          JOIN "ingredients" i ON ri."ingredient_id" = i."ingredient_id"
          JOIN "food" f ON i."food_id" = f."food_id"
          JOIN "pantries" p ON f."food_id" = p."food_id"
          LEFT JOIN "users" u ON u."user_id" = p."user_id"
        WHERE 
          u."user_id" = ${id}
      `;

      const countResult = await db.query(countQuery, {
        replacements: { id },
        type: QueryTypes.SELECT,
      });

      const totalMatchedRecipes = countResult[0].totalMatchedRecipes;

      // Query to get the paginated recipes
      const query = `
      SELECT 
        r.*, 
        COUNT(ri."ingredient_id") FILTER (WHERE f."food_id" IS NOT NULL) AS "foodCount",
        (SELECT COUNT(*) FROM "recipe_ingredients" WHERE "recipe_id" = r."recipe_id") AS "totalIngredients",
        (COUNT(ri.ingredient_id)::float / NULLIF((SELECT COUNT(*) FROM "recipe_ingredients" WHERE "recipe_id" = r."recipe_id"), 0)) as "foodCountRatio"
      FROM 
        "recipes" r
        JOIN "recipe_ingredients" ri ON r."recipe_id" = ri."recipe_id"
        LEFT JOIN "ingredients" i ON ri."ingredient_id" = i."ingredient_id"
        LEFT JOIN "food" f ON i."food_id" = f."food_id"
        LEFT JOIN "pantries" p ON f."food_id" = p."food_id"
        LEFT JOIN "users" u ON u."user_id" = p."user_id"
      WHERE 
        u."user_id" = ${id}
      GROUP BY 
        r."recipe_id"
      ORDER BY 
        "foodCountRatio" DESC,
        "foodCount" DESC
      LIMIT ${pageSize}
      OFFSET ${offset};
    `;

      const recipes = await db.query(query, {
        replacements: { id, pageSize, offset },
        type: QueryTypes.SELECT,
        model: Recipe,
        mapToModel: true,
      });

      res
        .status(200)
        .send({ recipes: recipes, totalMatchedRecipes: totalMatchedRecipes });
    } catch (error) {
      console.log(error);
      res.status(200).send({ recipes: [], totalMatchedRecipes: 0 });
    }
  },

  // get all recipes
  getAllRecipes: async (req, res) => {
    const { pageNum } = req.params;
    const { inputText, filters } = req.body;

    console.log("Query for page:", pageNum);

    console.log("inputText:", inputText);
    console.log("filters:", filters);

    const matchedLabels = await Label.findAll({
      where: {
        labelName: {
          [Op.in]: filters,
        },
      },
      subQuery: false,
      distinct: true,
    });

    if (matchedLabels.length === 0) {
      // Query to get the total count of matched recipes
      const countResult = await Recipe.findAll({
        where: {
          label: { [Op.iLike]: `%${inputText}%` },
        },
      });

      const totalMatchedRecipes = countResult.length;

      const allRecipes = await Recipe.findAll({
        where: {
          label: { [Op.iLike]: `%${inputText}%` },
        },
        offset: pageNum * 20,
        limit: 20,
        order: [["recipeId", "ASC"]],
      });

      res
        .status(200)
        .send({ recipes: allRecipes, totalRecipes: totalMatchedRecipes });
    } else {
      const matchedLabelIds = matchedLabels.map((el) => el.labelId);

      console.log("matchedLabelIds:", matchedLabelIds);

      const countResult = await Recipe.findAll({
        where: {
          label: { [Op.iLike]: `%${inputText}%` },
        },
        order: [["recipeId", "ASC"]],
        include: [
          {
            model: RecipeLabel,
            where: {
              labelId: {
                [Op.in]: matchedLabelIds,
              },
            },
          },
        ],
        subQuery: false,
        distinct: true,
      });

      const totalMatchedRecipes = countResult.length;

      const allRecipes = await Recipe.findAll({
        where: {
          label: { [Op.iLike]: `%${inputText}%` },
        },
        offset: pageNum * 20,
        limit: 20,
        order: [["recipeId", "ASC"]],
        include: [
          {
            model: RecipeLabel,
            where: {
              labelId: {
                [Op.in]: matchedLabelIds,
              },
            },
          },
        ],
        subQuery: false,
        distinct: true,
      });

      res
        .status(200)
        .send({ recipes: allRecipes, totalRecipes: totalMatchedRecipes });
    }
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

  // get all labels
  getAllLabels: async (req, res) => {
    const allLabels = await Label.findAll();

    res.status(200).send(allLabels);
  },

  // recipe caroussels
  highestRatedCarousel: async (req, res) => {
    const highestRatedRecipeIds = await Rating.findAll({
      attributes: [
        "recipeId",
        [Sequelize.fn("AVG", Sequelize.col("score")), "averageScore"],
      ],
      order: [["averageScore", "DESC"]],
      group: ["recipeId"],
      limit: 5,
    });

    // Convert averageScore to number
    const parsedRatings = highestRatedRecipeIds.map((rating) => ({
      ...rating.dataValues,
      averageScore: parseFloat(rating.dataValues.averageScore),
    }));

    res
      .status(200)
      .send({ recipes: parsedRatings, header: "Highest Rated Recipes" });
  },

  randomCarousel: async (req, res) => {
    const mealTypes = await Recipe.findAll({
      attributes: [
        Sequelize.fn("DISTINCT", Sequelize.col("meal_type")),
        "mealType",
      ],
      order: [["mealType", "ASC"]],
      where: {
        mealType: { [Op.not]: null },
      },
    });

    const dishTypes = await Recipe.findAll({
      attributes: [
        Sequelize.fn("DISTINCT", Sequelize.col("dish_type")),
        "dishType",
      ],
      order: [["dishType", "ASC"]],
      where: {
        dishType: { [Op.not]: null },
      },
    });

    const labels = await Label.findAll({
      order: [["labelId", "ASC"]],
    });

    const foods = await Food.findAll({
      order: [["foodId", "ASC"]],
    });

    const mealTypesArray = mealTypes.map((el) => el.mealType);
    const dishTypesArray = dishTypes.map((el) => el.dishType);
    const labelsArray = labels.map((el) => el.labelId);
    const foodsArray = foods.map((el) => el.foodId);

    const randomMealType =
      mealTypesArray[_lodash.random(0, mealTypesArray.length - 1)];
    const randomDishType =
      dishTypesArray[_lodash.random(0, dishTypesArray.length - 1)];
    const randomLabel = labelsArray[_lodash.random(0, labelsArray.length - 1)];
    const randomFood = foodsArray[_lodash.random(0, foodsArray.length - 1)];

    console.log("randomMealType:", randomMealType);
    console.log("randomDishType:", randomDishType);
    console.log("randomLabel:", randomLabel);
    console.log("randomFood:", randomFood);

    const queryType = _lodash.random(0, 3);
    console.log("queryType:", queryType);

    // response object
    let response = {};

    switch (queryType) {
      case 0:
        const recipesByMealType = await Recipe.findAll({
          where: {
            mealType: randomMealType,
          },
          limit: 5,
          order: [[Sequelize.fn("RANDOM")]],
        });
        console.log("recipesByMealType:", recipesByMealType);
        response = {
          recipes: recipesByMealType,
          header: `Featured ${randomMealType.replace(
            randomMealType.charAt(0),
            randomMealType.charAt(0).toUpperCase()
          )} Recipes`,
        };
        break;
      case 1:
        const recipesByDishType = await Recipe.findAll({
          where: {
            dishType: randomDishType,
          },
          limit: 5,
          order: [[Sequelize.fn("RANDOM")]],
        });
        console.log("recipesByDishType:", recipesByDishType);
        response = {
          recipes: recipesByDishType,
          header: `Featured ${randomDishType.replace(
            randomDishType.charAt(0),
            randomDishType.charAt(0).toUpperCase()
          )} Recipes`,
        };
        break;
      case 2:
        const recipesByLabel = await Recipe.findAll({
          include: [
            {
              model: RecipeLabel,
              attributes: ["labelId"],
              required: true,
              include: [
                {
                  model: Label,
                  where: { labelId: randomLabel },
                  attributes: ["labelName"],
                  required: true,
                },
              ],
            },
          ],
        });
        const shuffledRecipesByLabel = _lodash.shuffle(recipesByLabel);
        const fiveRecipesByLabel = shuffledRecipesByLabel.slice(0, 5);

        console.log("fiveRecipesByLabel:", fiveRecipesByLabel);

        response = {
          recipes: fiveRecipesByLabel,
          header: `Featured ${fiveRecipesByLabel[0].recipe_labels[0].label.labelName} Recipes`,
        };
        break;
      case 3:
        const recipesByFood = await Recipe.findAll({
          include: [
            {
              model: RecipeIngredient,
              attributes: ["ingredientId"],
              required: true,
              include: [
                {
                  model: Ingredient,
                  attributes: ["foodId"],
                  required: true,
                  include: [
                    {
                      model: Food,
                      where: { foodId: randomFood },
                      attributes: ["foodName"],
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        });

        const shuffledRecipesByFood = _lodash.shuffle(recipesByFood);
        const fiveRecipesByFood = shuffledRecipesByFood.slice(0, 5);

        console.log("fiveRecipesByFood:", fiveRecipesByFood);

        response = {
          recipes: fiveRecipesByFood,
          header: `Featured Recipes With ${fiveRecipesByFood[0].recipe_ingredients[0].ingredient.food.foodName}`,
        };
        break;
      default:
        const randomRecipes = await Recipe.findAll({
          order: [Sequelize.fn("RANDOM")],
          limit: 5,
        });

        console.log("randomRecipes:", randomRecipes);

        response = { recipes: randomRecipes, header: "Featured Recipes" };
        break;
    }

    // console.log("response:", response);

    // add average scores for recipes
    for await (let recipe of response.recipes) {
      const averageScore = await Rating.findAll({
        where: {
          recipeId: recipe.recipeId,
        },
        attributes: [
          [Sequelize.fn("AVG", Sequelize.col("score")), "averageScore"],
        ],
      });

      console.log("averageScore:", averageScore[0].toJSON().averageScore);

      if (averageScore[0].toJSON().averageScore === null) {
        recipe.setDataValue("averageScore", 0);
      } else {
        recipe.setDataValue(
          "averageScore",
          parseFloat(averageScore[0].toJSON().averageScore)
        );
      }
    }

    console.log("response:", response);

    res.status(200).send(response);
  },
};

export default handlerFunctions;
