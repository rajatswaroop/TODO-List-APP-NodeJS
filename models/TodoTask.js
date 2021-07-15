const mongoose = require('mongoose');

const todoTaskSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('TodoTask',todoTaskSchema);
