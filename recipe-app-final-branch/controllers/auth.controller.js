const { BadRequestError, UnauthorizeError } = require("../utils/errors")
const userDAO = require("../daos/user")
const bcrypt = require("bcrypt")
const jwt = require("../utils/token")

module.exports.signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            throw new BadRequestError("Name, Email and Password are required")
        }

        const existingUser = await userDAO.getUserByEmail(email)

        if (existingUser) {
            return res.status(409).send("User already exists")
        }

        const hash = await bcrypt.hash(password, 12)

        const user = {
            name,
            email,
            password: hash
        }

        const savedUser = await userDAO.createUser(user)
        res.status(201).json(savedUser)
    } catch (error) {
        next(error)
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new BadRequestError("Email and Password are required")
        }

        const user = await userDAO.getUserByEmail(email)

        if (!user) {
            throw new UnauthorizeError("Unauthorized")
        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {
            throw new UnauthorizeError("Unauthorized")
        }

        const token = jwt.createToken({
            _id: user._id,
            email: user.email,
            roles: user.roles
        })

        res.status(200).json({ token })
    } catch (error) {
        next(error)
    }
}

module.exports.updatePassword = async (req, res, next) => {
    try {
        const { password } = req.body
        const user = req.user

        if (!password) {
            throw new BadRequestError("Password is required")
        }

        const hash = await bcrypt.hash(password, 12)

        const updatedUser = await userDAO.updateUser(user._id, {
            password: hash
        })

        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}