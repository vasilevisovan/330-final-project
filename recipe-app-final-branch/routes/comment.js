const { Router } = require("express")
const router = Router()
const commentController = require("../controllers/comment.controller")
const authMiddlware = require("../middleware/authorization")

// POST /comments
router.post("/", authMiddlware.isAuthorized, commentController.createComment)

// GET /comments/by-recipe/:id
router.get("/by-recipe/:id", commentController.getComments)

// PUT /comments/:id
router.put("/:id", authMiddlware.isAuthorized, commentController.updateComment)

// DELETE /comments/:id
router.delete("/:id", authMiddlware.isAuthorized, commentController.deleteComment)

module.exports = router