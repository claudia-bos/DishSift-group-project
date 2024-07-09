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

  // edit rating

  // delete rating

  // get recipe ratings

  // get user's ratings

  // get all foods
  getAllFoods: async (req, res) => {
    const allFoods = await Food.findAll();

    console.log("allFoods:", allFoods);

    res.status(200).send({
      message: "finding base on food",
      foods: allFoods, 
    })
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
    const { id } = req.params;

    console.log("id:", id);

    const pantryRecipes = await Recipe.findAll({
      include: [
        {
          model: RecipeIngredient,
          required: true,
          include: [
            {
              model: Ingredient,
              required: true,
              include: [
                {
                  model: Food,
                  required: true,
                  include: [
                    {
                      model: Pantry,
                      where: { userId: id },
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

    // console.log('pantryRecipes:', pantryRecipes)

    res.status(200).send(pantryRecipes);
  },

  // get all ingredients

  // get all recipes

  // get all recipe ingredients

  // get all labels

  // get recipe labels
};

export default handlerFunctions;
