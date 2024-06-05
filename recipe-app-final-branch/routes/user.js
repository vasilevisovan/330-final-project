const { Router } = require("express")
const router = Router()
const userController = require("../controllers/user.controller")
const authMiddlware = require("../middleware/authorization")

// GET /users/
router.get('/', authMiddlware.isAuthorized, authMiddlware.isAdmin, userController.getUsers)

// GET /user/me
router.get('/me', authMiddlware.isAuthorized, userController.getMe)

// GET /user/:id 
router.get('/:id', authMiddlware.isAuthorized, userController.getUser)

// PUT /users/:d 
router.put('/', authMiddlware.isAuthorized, userController.upadateUser)

module.exports = router