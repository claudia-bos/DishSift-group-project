import { Model, DataTypes } from "sequelize"
import util from "util"
import url from "url"
import connectToDB from "./db.js"
import config from "../config/config.js"

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
            type: DataTypes.TEXT,
            allowNull: true,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: true
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
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: true // null if user leaves a comment without a rating
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
            type: DataTypes.TEXT,
            allowNull: true,
            unique: true,
            ignoreDuplicates: true
        },
        foodCategory: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true
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
            type: DataTypes.TEXT,
            allowNull: true
        },
        quantity: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        measure: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        weight: {
            type: DataTypes.FLOAT,
            allowNull: true
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
        label: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        thumbnailImage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        smallImage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        regularImage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        largeImage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sourceName: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        sourceUrl: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        yield: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        calories: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        totalWeight: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        totalTime: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        mealType: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        dishType: {
            type: DataTypes.TEXT,
            allowNull: true
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
            type: DataTypes.TEXT,
            allowNull: true,
            unique: true
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
Pantry.hasOne(Food, { 
    foreignKey: 'foodId',
    onDelete: 'CASCADE'
 })
Food.belongsTo(Pantry, { foreignKey: 'foodId' })

 // foods table relationships
Food.hasMany(Pantry, { 
    foreignKey: 'foodId', 
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