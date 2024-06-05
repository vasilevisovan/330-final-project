const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

dotenv.config()

module.exports.createToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
}

module.exports.verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, payload) => err ? reject(err) : resolve(payload)
        )
    })
}