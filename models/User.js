const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
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
    authProvider: {
        type: String,
        required: true,
        default: 'local',
        enum: ['local', 'google']
    },
    profilePicture: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', userSchema);