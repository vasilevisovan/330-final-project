const userDAO = require("../daos/user")
const { NotFoundError, ForbiddenError } = require("../utils/errors")

module.exports.getUsers = async (req, res, next) => {
    try {
        const users = await userDAO.getUsers()

        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

module.exports.getMe = async (req, res, next) => {
    try {
        const user = req.user 

        const userData = await userDAO.getUser(user._id)

        res.status(200).json(userData)
    } catch (error) {
        next(error)
    }
}

module.exports.getUser = async (req, res, next) => {
    try {
        const id = req.params.id

        const userData = await userDAO.getUser(id)

        if(!userData) {
            throw new NotFoundError("user not found")
        }

        res.status(200).json(userData)
    } catch (error) {
        next(error)
    }
}

module.exports.upadateUser = async (req, res, next) => {
    try {
        const { name, profilePicture } = req.body
        const user = req.user

        const userExist = await userDAO.getUser(user._id)

        if(!userExist) {
            throw new NotFoundError("user not found")
        }

        const updatedUser = await userDAO.updateUser(user._id, {
            name,
            profilePicture
        })

        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}