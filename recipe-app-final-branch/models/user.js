const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    roles: {
        type: [String],
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
