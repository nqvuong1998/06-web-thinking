const redisClient = require('../configs/redis').client;
const userModel = require('../models/users');
const userService = require('../services/users');

function getHistory (){

}

module.exports = {
    getHistory: getHistory
}