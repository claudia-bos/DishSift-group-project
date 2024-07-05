import { Model, DataTypes } from "sequelize"
import util from "util"
import url from "url"
import connectToDB from "./db.js"
import config from "../../config/config.js"

const db = await connectToDB(`postgresql:///${config.DB_NAME}`)

export class User extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

User.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        modelName: 'user',
        sequelize: db
    }
)

export class Favorite extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

Favorite.init(
    {
        favoriteId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
    },
    {
        modelName: 'favorite',
        sequelize: db
    }
)

export class Rating extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

Rating.init(
    {
        ratingId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    },
    {
        modelName: 'rating',
        sequelize: db
    }
)

export class Pantry extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

Pantry.init(
    {
        pantryId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    },
    {
        modelName: 'pantry',
        sequelize: db
    }
)

export class Food extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

Food.init(
    {
        foodId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        foodName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        foodCategory: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        modelName: 'food',
        sequelize: db
    }
)

export class Ingredient extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

Ingredient.init(
    {
        ingredientId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
        measure: {
            type: DataTypes.STRING,
            allowNull: false
        },
        weight: {
            type: DataTypes.NUMBER,
            allowNull: false
        }
    },
    {
        modelName: 'ingredient',
        sequelize: db
    }
)

export class Recipe extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

Recipe.init(
    {
        recipeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        thumbnailImage: {
            type: DataTypes.STRING,
            allowNull: false
        },
        smallImage: {
            type: DataTypes.STRING,
            allowNull: false
        },
        regularImage: {
            type: DataTypes.STRING,
            allowNull: false
        },
        largeImage: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sourceName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sourceUrl: {
            type: DataTypes.STRING,
            allowNull: false
        },
        yield: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
        calories: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        totalWeight: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        totalTime: {
            type: DataTypes.NUMBER,
            allowNull: false
        },
        mealType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dishType: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        modelName: 'recipe',
        sequelize: db
    }
)

export class RecipeIngredient extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

RecipeIngredient.init(
    {
        recipeIngredientId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        modelName: 'recipe_ingredient',
        sequelize: db
    }
)

export class Label extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

Label.init(
    {
        labelId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        labelName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        modelName: 'label',
        sequelize: db
    }
)

export class RecipeLabel extends Model {
    [util.inspect.custom]() {
        return this.toJSON()
    }
}

RecipeLabel.init(
    {
        recipeLabelId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        }
    },
    {
        modelName: 'recipe_label',
        sequelize: db
    }
)

// user table relationships
User.hasMany(Pantry, { 
    foreignKey: 'userId', 
    onDelete: 'CASCADE'
})
Pantry.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(Rating, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})
Rating.belongsTo(User, { foreignKey: 'userId' })

User.hasMany(Favorite, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
})
Favorite.belongsTo(User, { foreignKey: 'userId' })

// pantries table relationships
Pantry.hasMany(Food, { 
    primaryKey: 'foodId',
    onDelete: 'CASCADE'
 })
Food.belongsTo(Pantry, { foreignKey: 'foodId' })

 // foods table relationships
Food.hasMany(Pantry, { 
    primaryKey: 'foodId', 
    onDelete: 'CASCADE'
})
Pantry.belongsTo(Food, { foreignKey: 'foodId' })

Food.hasMany(Ingredient, { 
    foreignKey: 'foodId', 
    onDelete: 'CASCADE'
})
Ingredient.belongsTo(Food, { foreignKey: 'foodId' })

// ingredients table relationships
Ingredient.hasMany(RecipeIngredient, { 
    foreignKey: 'ingredientId', 
    onDelete: 'CASCADE'
})
RecipeIngredient.belongsTo(Ingredient, { foreignKey: 'ingredientId' })

// recipes table relationships
Recipe.hasMany(RecipeLabel, { 
    foreignKey: 'recipeId',
    onDelete: 'CASCADE'
})
RecipeLabel.belongsTo(Recipe, { foreignKey: 'recipeId' })

Recipe.hasMany(Favorite, { 
    foreignKey: 'recipeId', 
    onDelete: 'CASCADE'
})
Favorite.belongsTo(Recipe, { foreignKey: 'recipeId' })

Recipe.hasMany(Rating, { 
    foreignKey: 'recipeId', 
    onDelete: 'CASCADE'
})
Rating.belongsTo(Recipe, { foreignKey: 'recipeId' })

Recipe.hasMany(RecipeIngredient, { 
    foreignKey: 'recipeId',
    onDelete: 'CASCADE'
})
RecipeIngredient.belongsTo(Recipe, { foreignKey: 'recipeId' })

// recipe_labels table relationships
RecipeLabel.hasMany(Label, {
    foreignKey: 'labelId',
    onDelete: 'CASCADE'
})
Label.belongsTo(RecipeLabel, { foreignKey: 'labelId' })

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
    console.log('Syncing database...')
    await db.sync()
    console.log('Finished syncing database!')
}

export default db