const { BadRequestError, NotFoundError, ForbiddenError } = require("../utils/errors")
const commentDAO = require("../daos/comment")
const recipeDAO = require("../daos/recipe")

module.exports.createComment = async (req, res, next) => {
    try {
        const user = req.user 
        const { recipe, text } = req.body

        const recipeExist = await recipeDAO.getRecipe(recipe)

        if(!recipeExist) {
            throw new NotFoundError(`cannot find recipe with ${recipe}`)
        }

        const comment = await commentDAO.createComment(
            user._id,
            {
                recipe,
                text
            }
        )

        res.status(201).json(comment)
    } catch (error) {
        next(error)
    }
}

module.exports.getComments = async (req, res, next) => {
    try {
        const id = req.params.id 

        const recipeExist = await recipeDAO.getRecipe(id)

        if(!recipeExist) {
            throw new NotFoundError(`cannot find recipe with ${id}`)
        }

        const comments = await commentDAO.getComments(id)

        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
}

module.exports.updateComment = async (req, res, next) => {
    try {
        const user = req.user
        const id = req.params.id
        const { text } = req.body

        const commentExist = await commentDAO.getComment(id)

        if (!commentExist) {
            throw new NotFoundError(`cannot find comment with id: ${id}`)
        }

        if (user._id != commentExist.user._id.toString()) {
            throw new ForbiddenError("You are not allowed")
        }

        const updatedComment = await commentDAO.updateComment(id, text)

        res.status(200).json(updatedComment)
    } catch (error) {
        next(error)
    }
}

module.exports.deleteComment = async (req, res, next) => {
    try {
        const user = req.user
        const id = req.params.id

        const commentExist = await commentDAO.getComment(id)

        if (!commentExist) {
            throw new NotFoundError(`cannot find comment with id: ${id}`)
        }

        if (user._id != commentExist.user._id.toString()) {
            throw new ForbiddenError("You are not allowed")
        }

        await commentDAO.deleteComment(id)

        res.status(200).send()
    } catch (error) {
        next(error)
    }
}