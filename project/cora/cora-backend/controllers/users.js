const userModel = require('../models/users');
const userService = require('../services/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redisClient = require('../configs/redis').client;

async function create(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    try{
        var findUser = await userService.findExistUser(username);
        if(findUser==null){
            let user = new userModel({
                username: username,
                password: password
            });
    
                let value = await user.save();
                res.json({
                    status: "success",
                    message: "User added successfully!!!",
                    data: null
                });
    
                await redisClient.sadd("users:username:"+username,value._id);
    
                await redisClient.hmset("users:"+value._id,{
                    id: value._id,
                    username: username,
                    total_money: value.total_money,
                    win_count: value.win_count,
                    total_count: value.total_count,
                    //games: []
                });
        }
        else{
            res.status(403);
            res.json({
                status: "fail",
                message: "User exists",
                data: null
            })
        }
    }
    catch(err){
        res.json({
            status: "error",
            message: "Error to save user",
            data: null
        });
    }
}

const gameServices = require('../services/games');

async function authenticate(req, res) {

    var username = req.body.username;
    var password = req.body.password;
    
    try{
        var findUser = await userService.findExistUser(username);
        gameServices.getPoolCreate();
        if(findUser==null){
            res.json({
                status: "error",
                message: "Invalid username!!!",
                data: null
            });
        }
        else{
            if (bcrypt.compareSync(password, findUser.password)){
                const token = jwt.sign({
                    id: findUser._id,
                    username: findUser.username
                }, req.app.get('secretKey'), {
                    expiresIn: '12h'
                });
    
                res.json({
                    status: "success",
                    message: "User found!!!",
                    data: {
                        user_id: findUser._id,
                        username: findUser.username,
                        total_money: findUser.total_money,
                        token: token
                    }
                });
            }
            else {
                res.json({
                    status: "error",
                    message: "Invalid password!!!",
                    data: null
                });
            }
        }
    }
    catch(err){
        res.json({
            status: "error",
            message: "Something was wrong",
            data: null
        });
    }
    
    
}


module.exports = {
    authenticate: authenticate,
    create: create
}