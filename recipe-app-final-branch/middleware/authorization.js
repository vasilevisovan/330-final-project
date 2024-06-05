const jwt = require('jsonwebtoken')

const token = require('../utils/token')

module.exports.isAuthorized = async (req, res, next) => {
    const bearer = req.headers.authorization

    if(!bearer || !bearer?.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'You are not authenticated!'
        })
    }

    const accessToken = bearer?.split('Bearer ')[1].trim()

    try {
        const payload = await token.verifyToken(accessToken)

        if(payload instanceof jwt.JsonWebTokenError || payload instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'You are not authenticated!'
            })
        }

        req.user = payload
        next()
    } catch (e) {
        return res.status(401).json({
            message: 'You are not authenticated!'
        })
    }
}

module.exports.isAdmin = async (req, res, next) => {
    if(req.user.roles.includes('admin')) {
        next()
    } else {
        return res.status(403).json({
            message: 'You are not authorized!'
        })
    }
}