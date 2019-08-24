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
            turn: "X"
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

            if(message.user_id==result.host){
                return resolve(null);
            }

            await redisClient.del('games:false:'+id);

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

function insertGameInMongo(game){
    return new Promise(async function(resolve, reject){
        let id = game.id;
        try{
            let newGame = new gameModel({
                title: game.title,
                created_at: game.created_at,
                bet_money: game.bet_money,
                result: game.result,
                host: game.host,
                host_name: game.host_name,
                opponent: game.opponent,
                opponent_name: game.opponent_name
            });

            await newGame.save();

            await redisClient.del("games:true:"+id);

            setHistoryInRedis(newGame);
            
            let userInfo = {
                user_id: game.host,
                bet_money: game.bet_money,
                result: "win"
            }
            if(game.result=="win"){
                await updateUserInfo(userInfo);
                userInfo.user_id = game.opponent;
                userInfo.result = "lose";
                await updateUserInfo(userInfo);
            }
            else if(game.result=="lose"){
                userInfo.result = "lose";
                await updateUserInfo(userInfo);
                userInfo.user_id = game.opponent;
                userInfo.result = "win";
                await updateUserInfo(userInfo);
            }
            else{
                userInfo.result = "draw";
                await updateUserInfo(userInfo);
                userInfo.user_id = game.opponent;
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
            user.total_count=parseInt(user.total_count)+1;
            if(result=="win"){
                user.win_count=parseInt(user.win_count)+1;
                user.total_money=parseInt(user.total_money)+parseInt(bet_money);
            }
            else if(result=="lose"){
                user.total_money=parseInt(user.total_money)-parseInt(bet_money);
            }
            
            await userModel.findByIdAndUpdate(id, {
                total_money: user.total_money,
                win_count: user.win_count,
                total_count: user.total_count
            },{new: true});

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
                if(!value){
                    resolve(null);
                }

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

function checkWin(board, row, col, turn){
  let piece_win = [];
  // check col win
  let index = col - 1;

  while (index >= 0 && board[row][index] == turn) {
    piece_win.push([row, index]);
    index--;
  }

  index = col + 1;
  while (index <= board.length - 1 && board[row][index] == turn) {
    piece_win.push([row, index]);
    index++;
  }

  if (piece_win.length >= 4) {
    piece_win.push([row, col]);
    return piece_win;
  }

  // check row
  index = row - 1;
  piece_win = [];
  while (index >= 0 && board[index][col] == turn) {
    piece_win.push([index, col]);
    index--;
  }

  index = row + 1;
  while (index >= 0 && index < board.length - 1 && board[index][col] == turn) {
    piece_win.push([index, col]);
    index++;
  }

  console.log(piece_win)

  if (piece_win.length >= 4) {
    piece_win.push([row, col]);
    return piece_win;
  }

  // check diagonal left
  let row_index = row - 1;
  let col_index = col - 1;
  piece_win = [];

  while (
    row_index >= 0 &&
    col_index >= 0 &&
    board[row_index][col_index] == turn
  ) {
    piece_win.push([row_index, col_index]);
    row_index--;
    col_index--;
  }

  row_index = row + 1;
  col_index = col + 1;
  while (
    row_index >= 0 &&
    col_index >= 0 &&
    row_index <= board.length - 1 &&
    col_index <= board.length - 1 &&
    board[row_index][col_index] == turn
  ) {
    piece_win.push([row_index, col_index]);
    row_index++;
    col_index++;
  }

  if (piece_win.length >= 4) {
    piece_win.push([row, col]);
    return piece_win;
  }
  // check diagonal left
  row_index = row - 1;
  col_index = col + 1;
  piece_win = [];
  while (
    col_index >= 0 &&
    row_index >=0 &&
    col_index <= board.length - 1 &&
    board[row_index][col_index] == turn
  ) {
    piece_win.push([row_index, col_index]);
    row_index--;
    col_index++;
  }
  row_index = row + 1;
  col_index = col - 1;
  while (
    row_index >= 0 &&
    row_index <= board.length - 1 &&
    col_index >= 0 &&
    board[row_index][col_index] == turn
  ) {
    piece_win.push([row_index, col_index]);
    row_index++;
    col_index--;
  }

  if (piece_win.length >= 4) {
    piece_win.push([row, col]);
    return piece_win;
  }
  return [];
}

function isAllowTurnGame(message){
    return new Promise(async function(resolve, reject){
        let id = message.game_id;
        try{
            let game = await redisClient.hgetall("games:true:"+id);
            if((game.turn=="X"&&game.host==message.user_id)||(game.turn=="O"&&game.opponent==message.user_id)){
                resolve(game);
            }
            else{
                resolve(null);
            }
        }
        catch(err){
            reject(err);
        }
    });
}

function setNewInfoGame(game, result, isNotDraw, isIgnore){
    return new Promise(async function(resolve,reject){
        if(isIgnore==false){
            if(game.turn=="X")game.turn="O";
            else game.turn="X";
        }
        

        let id = game.id;
        let isEndGame = false;

        if(isNotDraw==true){
            
            if(result.length>0){
                if(game.turn=="O"){
                    game.result = "win";
                }
                else{
                    game.result = "lose";
                }
                isEndGame = true;
            }
        }
        else{
            game.result = "draw";
            isEndGame = true;
        }

        try{
            
            if(isEndGame==true){
                await insertGameInMongo(game);
            }
            else{
                await redisClient.hmset("games:true:"+id, game);
            }
            resolve(game);
        }
        catch(err){
            reject(err);
        }
    });
}

module.exports = {
    createGameInRedis: createGameInRedis,
    updateOpponentGameInRedis: updateOpponentGameInRedis,
    cancelGameInRedis: cancelGameInRedis,
    insertGameInMongo: insertGameInMongo,
    updateUserInfo: updateUserInfo,
    getUserInfo: getUserInfo,
    getGameNotReady: getGameNotReady,
    checkGameNotReady: checkGameNotReady,
    checkWin: checkWin,
    isAllowTurnGame: isAllowTurnGame,
    setNewInfoGame: setNewInfoGame
}

