const mongoose = require("mongoose")
const User = require("../models/user")
const { BadRequestError } = require("../utils/errors")

module.exports.createUser = async (userObj) => {
    try {
        const user = await User.create({
            ...userObj,
            roles: ["user"]
        })

        return user
    } catch (e) {
        throw e
    }
}

module.exports.getUserByEmail = (email) => {
    return User.findOne({ email }).lean()
}

module.exports.getUsers = () => {
    return User.find()
}

module.exports.getUser = (id) => {
    if(!mongoose.Types.ObjectId.isValid(id)) {
        throw new BadRequestError("Invalid user id")
    }

    return User.findById(id)
}

module.exports.updateUser = async (userId, newUser) => {
    if(!mongoose.Types.ObjectId.isValid(userId)) {
        throw new BadRequestError("Invalid user id")
    }

    const user = await User.findOneAndUpdate(
        {
            _id: userId
        },
        {
            $set: {
                ...newUser
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    return user
}
