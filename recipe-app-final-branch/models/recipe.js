const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    ingredients: [{
        type: String,
        required: true
    }],
    instructions: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    image: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

}, {
    timestamps: true
});

RecipeSchema.path('ingredients').validate(function (value) {
    return value.length > 0;
}, 'Ingredients array cannot be empty')

RecipeSchema.index({ title: "text", ingredients: "text" });
RecipeSchema.index({ user: 1 })

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;
