const mongoose = require("mongoose")
const Comment = require("../models/comment")
const { BadRequestError } = require("../utils/errors")

module.exports.createComment = async (userId, data) => {
    try {
        const comment = await Comment.create({
            ...data,
            user: userId
        })

        return comment
    } catch (error) {
        throw error
    }
}

module.exports.getComments = (recipeId) => {
    return Comment.find({
        recipe: recipeId
    })
}

module.exports.getComment = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid id")
    }

    return Comment.findById(id).lean()
        .populate({ path: 'user', select: "name"})
}

module.exports.updateComment = async (id, text) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid id")
    }

    const comment = await Comment.findOneAndUpdate(
        {
            _id: id
        },
        {
            $set: {
                text: text
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    return comment
}

module.exports.deleteComment = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid id")
    }

    return Comment.findByIdAndDelete(id)
}