const mongoose = require('mongoose');
const User = require('./users');

const Schema = mongoose.Schema;
const GameSchema = new Schema({
    title: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    bet_money: {
        type: Number,
    },
    result: {
        type: String
    },
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    host_name: {
        type: String
    },
    opponent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    opponent_name: {
        type: String
    }
});

module.exports = mongoose.model('Game', GameSchema);