const { BadRequestError, NotFoundError, ForbiddenError } = require("../utils/errors")
const recipeDAO = require("../daos/recipe")

module.exports.createRecipe = async (req, res, next) => {
    try {
        const user = req.user 

        const recipe = await recipeDAO.createRecipe(
            req.body,
            user._id
        )

        res.status(201).json(recipe)
    } catch (error) {
        next(error)
    }
}

module.exports.getRecipes = async (req, res, next) => {
    try {
        const recipes = await recipeDAO.getRecipes()

        res.status(200).json(recipes)
    } catch (error) {
        next(error)
    }
}

module.exports.getRecipe = async (req, res, next) => {
    try {
        const id = req.params.id 

        const recipe = await recipeDAO.getRecipe(id)

        if (!recipe) {
            throw new NotFoundError(`cannot find recipe with id: ${id}`)
        }

        return res.status(200).json(recipe)
    } catch (error) {
        next(error)
    }
}

module.exports.getMyRecipes = async (req, res, next) => {
    try {
        const user = req.user

        const recipes = await recipeDAO.getRecipesByUser(user._id)

        res.status(200).json(recipes)
    } catch (error) {
        next(error)
    }
}

module.exports.updateRecipe = async (req, res, next) => {
    try {
        const user = req.user
        const id = req.params.id

        const recipeExist = await recipeDAO.getRecipe(id)

        if (!recipeExist) {
            throw new NotFoundError(`cannot find recipe with id: ${id}`)
        }

        if (user._id != recipeExist.user._id.toString() && !user.roles.includes("admin")) {
            throw new ForbiddenError("You are not allowed")
        }

        const updatedRecipe = await recipeDAO.updateRecipe(id, req.body)

        res.status(200).json(updatedRecipe)
    } catch (error) {
        next(error)
    }
}

module.exports.deleteRecipe = async (req, res, next) => {
    try {
        const user = req.user
        const id = req.params.id

        const recipeExist = await recipeDAO.getRecipe(id)

        if (!recipeExist) {
            throw new NotFoundError(`cannot find recipe with id: ${id}`)
        }

        if (user._id != recipeExist.user._id.toString() && !user.roles.includes("admin")) {
            throw new ForbiddenError("You are not allowed")
        }

        await recipeDAO.deleteRecipe(id)

        res.status(200).send()
    } catch (error) {
        next(error)
    }
}

module.exports.searchRecipe = async (req, res, next) => {
    try {
        const { query } = req.body

        if(!query) {
            throw new BadRequestError("Query must be provided")
        }

        const result = await recipeDAO.searchRecipe(query)

        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}