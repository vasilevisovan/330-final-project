const { Router } = require("express")
const router = Router()
const recipeController = require("../controllers/recipe.controller")
const authMiddlware = require("../middleware/authorization")

// POST /recipe
router.post("/", authMiddlware.isAuthorized, recipeController.createRecipe)

// GET /recipe
router.get("/", recipeController.getRecipes)

// GET /recipe/my
router.get("/my", authMiddlware.isAuthorized, recipeController.getMyRecipes)

// GET /recipe/:id
router.get("/:id", recipeController.getRecipe)

// PUT /recipe/:id
router.put("/:id", authMiddlware.isAuthorized, recipeController.updateRecipe)

// DELETE /recipe/:id
router.delete("/:id", authMiddlware.isAuthorized, recipeController.deleteRecipe)

// POST /recipe/search
router.post("/search", recipeController.searchRecipe)

module.exports = router