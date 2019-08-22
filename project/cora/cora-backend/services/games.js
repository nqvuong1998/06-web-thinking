const redisClient = require('../configs/redis').client;
const userModel = require('../models/users');
const gameModel = require('../models/games');
const userService = require('../services/users');
const uuid = require('uuid');

function createGameInRedis(message){
    return new Promise(async function(resolve, reject){
        let id = uuid.v1().toString();
        
        let newGame = {
            id: id,
            title: message.username+" 's room",
            created_at: (new Date()).toLocaleString(),
            host: message.user_id,
            host_name: message.username,
            opponent: "",
            opponent_name: "",
            result: "",
            bet_money: message.bet_money,
        }
        
        try{
            await redisClient.hmset("games:false:"+id,newGame);
            resolve(newGame);
        }
        catch(err){
            reject(err);
        }
    });
}

function updateOpponentGameInRedis(message){
    return new Promise(async function(resolve, reject){
        let id = message.game_id;

        try{
            let result = await redisClient.hgetall('games:false:'+id);
            await redisClient.del('games:false:'+id)
            let opponent = message.user_id;
            let opponent_name = message.username;

            result.opponent=opponent;
            result.opponent_name=opponent_name;

            await redisClient.hmset("games:true:"+id,result);
            
            resolve(result);
        }
        catch(err){
            reject(err);
        }
    });
}

function checkGameNotReady(message){
    return new Promise(async function (resolve,reject){
        let id = message.game_id;

        try{
            let value = await redisClient.keys('games:false:'+id);
            //console.log(value.length);
            if(value.length>0){
                resolve(true);
            }
            else resolve(false);
        }
        catch(err){
            reject(error);
        }
    });
}

// function updateResultGameInRedis(){
//     return new Promise(async function(resolve, reject){
//         let id = message.game_id;

//         try{
//             let result = await redisClient.hgetall('games:'+id);
//             let result_game = message.result;

//             result.result=result_game;

//             let value = await redisClient.hmset("games:"+id,result);
//             resolve(value);
//         }
//         catch(err){
//             reject(err);
//         }
//     });
// }

function cancelGameInRedis(message){
    return new Promise(async function(resolve, reject){
        let id = message.game_id;

        try{

            await redisClient.del('games:false:'+id);
            resolve(null);
        }
        catch(err){
            reject(err);
        }
    });
}

function insertGameInMongo(message){
    return new Promise(async function(resolve, reject){
        let id = message.game_id;

        try{
            let value = await redisClient.hgetall('games:true:'+id);
            value.result = message.result;
            
            let newGame = new gameModel({
                title: value.title,
                created_at: value.created_at,
                bet_money: value.bet_money,
                result: value.result,
                host: value.host,
                host_name: value.host_name,
                opponent: value.opponent,
                opponent_name: value.opponent_name
            });

            await newGame.save();

            await redisClient.del("games:true:"+id);

            setHistoryInRedis(newGame);
            
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

            resolve(newGame);
        }
        catch(err){
            reject(err);
        }
    });
}

function updateUserInfo(message){
    return new Promise(async function(resolve, reject){
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

            await userModel.findByIdAndUpdate(id, {
                total_money: user.total_money,
                win_count: user.win_count,
                total_count: user.total_count
            });

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

function getUserInfo(message){
    return new Promise(async function(resolve, reject){
        let id = message.user_id;
        try{
            let user = await redisClient.hgetall("users:"+id);

            if(!user){
                let value = await userModel.findById(id);

                await redisClient.hmset("users:"+value._id.toString(),{
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

function getGameNotReady(){
    return new Promise(async function(resolve, reject){
        try{
            let listNotReady = await redisClient.keys("games:false:*");
            var list = [];
            if(listNotReady.length!=0){
                let len = listNotReady.length;
                for(let i = 0;i<len;i++){
                    list.push(await redisClient.hgetall(listNotReady[i]));
                }
                list.sort(function(a, b){
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                resolve(list);
            }
            else resolve([]);
        }
        catch(err){
            reject(err);
        }
    });
}

function setHistoryInRedis(message){
    return new Promise(async function(resolve, reject){
        try{
            
        }
        catch(err){
            reject(err);
        }
    });
}

function getHistory(){
    return new Promise(async function(resolve, reject){
        try{
            
        }
        catch(err){
            reject(err);
        }
    });
}

function setRankingInRedis(message){
    return new Promise(async function(resolve, reject){
        let host = message.host;
        let opponent = message.opponent;
        try{
            // let games = [];
            // games = await redisClient.hget("users:"+host);
            // //games.push
            // if(games.length===0){

            // }
        }
        catch(err){
            reject(err);
        }
    });
}

function getRanking(){
    return new Promise(async function(resolve, reject){
        try{
            
        }
        catch(err){
            reject(err);
        }
    });
}

function checkWin(){
    board = [["X", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "X", "O", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "O", "E", "X", "O", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "X", "E", "O", "E", "X", "O", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "O", "E", "X", "E", "X", "O", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "X", "E", "E", "E", "E", "E", "X", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E", "E"]
];



    board = board.map(function(row){
        return row.join("");
    }).join("E");
    
   //console.log(/(X{5,5})|O{5,5})/.test(board,toString()));
}

module.exports = {
    createGameInRedis: createGameInRedis,
    updateOpponentGameInRedis: updateOpponentGameInRedis,
    //updateResultGameInRedis: updateResultGameInRedis,
    cancelGameInRedis: cancelGameInRedis,
    insertGameInMongo: insertGameInMongo,
    updateUserInfo: updateUserInfo,
    getUserInfo: getUserInfo,
    getGameNotReady: getGameNotReady,
    checkGameNotReady: checkGameNotReady,
    checkWin: checkWin
}

