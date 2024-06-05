const { Router } = require("express")
const router = Router()
const authController = require("../controllers/auth.controller")
const authMiddlware = require("../middleware/authorization")

// POST /auth/signup
router.post('/signup', authController.signUp)

// POST /auth/login
router.post('/login', authController.login)

// PUT /auth/password
router.put('/password', authMiddlware.isAuthorized, authController.updatePassword)

module.exports = router