const { Router } = require("express")

const router = Router()

router.use("/auth", require("./auth"))
router.use("/users", require("./user"))
router.use("/recipe", require("./recipe"))
router.use("/comments", require("./comment"))

router.use(async(req, res) => {
    res.status(404).send("Route does not exist")
})

router.use(async (err, req, res, next) => {
    
    let customError = {
        statusCode: err.statusCode || 500,
        msg: err.message || 'Something went wrong try again later',
    }
    
    if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors)
        .map((item) => item.message)
        .join(',')
        customError.statusCode = 400
    }
    
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(
            err.keyValue
        )} field, please choose another value`
        customError.statusCode = 400
    }
    
    if (err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = 404
    }
    
    return res.status(customError.statusCode).json(customError)
})

module.exports = router;