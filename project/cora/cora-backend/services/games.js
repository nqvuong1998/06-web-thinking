const redisClient = require('../configs/redis').client;
const userModel = require('../models/users');
const gameModel = require('../models/games');
const userService = require('../services/users');
const uuid = require('uuid');
const mongoose = require('mongoose');

async function createGameInRedis(message){
    return new Promise(function(resolve, reject){
        let id = uuid.v1().toString();
        let newGame = {
            id: id,
            title: "Room's "+message.username,
            created_at: Date.now,
            host: message.user_id,
            opponent: "",
            result: "",
            bet_money: message.bet_money,
            is_ready: false
        }
        try{
            let result = await redisClient.hmset("games:"+id,newGame);
        }
        catch(err){
            reject(err);
        }
    });
}

async function updateOpponentGameInRedis(message){
    return new Promise(function(resolve, reject){
        let id = message.game_id;

        try{
            let result = await redisClient.hgetall('games:'+id);
            let opponent = message.user_id;

            result.opponent=opponent;
            result.is_ready=true;

            let value = await redisClient.hmset("games:"+id,result);
            resolve(value);

        }
        catch(err){
            reject(err);
        }
    });
}

async function updateResultGameInRedis(){
    return new Promise(function(resolve, reject){
        let id = message.game_id;

        try{
            let result = await redisClient.hgetall('games:'+id);
            let result_game = message.result;

            result.result=result_game;

            let value = await redisClient.hmset("games:"+id,result);
            resolve(value);
        }
        catch(err){
            reject(err);
        }
    });
}

async function removeGameInRedis(message){
    return new Promise(function(resolve, reject){
        let id = message.game_id;

        try{
            await redisClient.del('games:'+id);
            resolve(null);
        }
        catch(err){
            reject(err);
        }

        redisClient.del('games:'+id)
        .then(result=>{
            resolve(null);
        })
        .catch(err=>{
            reject(err);
        });
    });
}

async function insertGameInMongo(message){
    return new Promise(function(resolve, reject){
        let id = message.game_id;

        try{
            let value = await redisClient.hgetall('games:'+id);
            value.result = message.result;
            
            let newGame = new gameModel({
                title: value.title,
                created_at: value.created_at,
                bet_money: value.bet_money,
                result: value.result,
                host: value.host,
                opponent: value.opponent
            });

            await newGame.save();

            await removeGameInRedis({game_id: id});
            
            let userInfo = {
                user_id: value.host,
                bet_money: value.bet_money,
                result: "win"
            }
            if(value.result=="win"){
                await updateUserInfo(userInfo);
                userInfo.user_id = value.opponent;
                userInfo.result = "lose";
                await updateUserInfo(userInfo);
            }
            else if(value.result=="lose"){
                userInfo.result = "lose";
                await updateUserInfo(userInfo);
                userInfo.user_id = value.opponent;
                userInfo.result = "win";
                await updateUserInfo(userInfo);
            }
            else{
                userInfo.result = "draw";
                await updateUserInfo(userInfo);
                userInfo.user_id = value.opponent;
                await updateUserInfo(userInfo);
            }
        }
        catch(err){
            reject(err);
        }
    });
}

async function updateUserInfo(message){
    return new Promise(function(resolve, reject){
        let id = message.user_id;
        let bet_money = message.bet_money;
        let result = message.result;
        try{
            let user = await getUserInfo({user_id: id});
            user.total_count+=1;
            if(result=="win"){
                user.win_count+=1;
                user.total_money+=bet_money;
            }
            else if(result=="lose"){
                user.win_count-=1;
                user.total_money-=bet_money;
            }

            mongoose.Collection.update(
                { _id: id },
                {
                    $set: {
                        total_money: user.total_money,
                        win_count: user.win_count,
                        total_count: user.total_count
                    }
                }
            );

            let userCache = await redisClient.hgetall("users:"+id);
            userCache.total_count = user.total_count;
            userCache.win_count = user.win_count;
            userCache.total_money = user.total_money;

            redisClient.hmset("users:"+id,userCache);
            resolve(user);
        }
        catch(err){
            reject(err);
        }
    });
}

async function getUserInfo(message){
    return new Promise(function(resolve, reject){
        let id = message.user_id;
        try{
            let user = await redisClient.hgetall(id);
            if(!user){
                let value = await userModel.findById(id);

                await redisClient.hmset("users:"+value._id,{
                    id: value._id,
                    username: value.username,
                    total_money: value.total_money,
                    win_count: value.win_count,
                    total_count: value.total_count
                });

                resolve(value);
            }
            else{
                resolve(user);
            }
        }
        catch(err){
            reject(err);
        }
    });
}

function rankingInRedis(){

}

function getRanking(){

}

