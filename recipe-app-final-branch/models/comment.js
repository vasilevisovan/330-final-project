const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe'
    },
    text: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;