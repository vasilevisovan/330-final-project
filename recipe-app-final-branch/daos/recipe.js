const mongoose = require("mongoose")
const Recipe = require("../models/recipe")
const { BadRequestError } = require("../utils/errors")

module.exports.createRecipe = async (recipeObj, userId) => {
    try {
        const recipe = await Recipe.create({
            ...recipeObj,
            user: userId
        })

        return recipe
    } catch (error) {
        throw error 
    }
}

module.exports.getRecipes = () => {
    return Recipe.find().sort({"_id": "desc"}).populate({
        path: 'user', select: "name"
    })
}

module.exports.getRecipe = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid id")
    }

    return Recipe.findById(id).populate({
        path: 'user', select: "name"
    }).lean()
}

module.exports.getRecipesByUser = (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestError("Invalid user id")
    }

    return Recipe.find({
        user: userId
    })
}

module.exports.updateRecipe = async (id, data) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid user id")
    }

    const recipe = await Recipe.findOneAndUpdate(
        {
            _id: id
        },
        {
            $set: {
                ...data
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    return recipe
}

module.exports.searchRecipe = async (query) => {
    try {
        const results = await Recipe
            .find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
            .sort({ score: { $meta: "textScore" } })
            .populate({
                path: 'user', select: "name"
            })

        return results;
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecipe = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid id")
    }

    return Recipe.findByIdAndDelete(id)
}


