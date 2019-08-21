const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 7;

//Define a schema
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    total_money: {
        type: Number,
        default: 10000
    },
    win_count: {
        type: Number,
        default: 0
    },
    total_count: {
        type: Number,
        default: 0
    }
});

UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});


UserSchema.virtual('games',{
    ref: 'Game',
    localField: '_id',
    foreignField: 'host'
});

UserSchema.virtual('games',{
    ref: 'Game',
    localField: '_id',
    foreignField: 'opponent'
});

module.exports = mongoose.model('User', UserSchema);