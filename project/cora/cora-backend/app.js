const express = require('express');
const logger = require('morgan');
//const movies = require('./routes/movies') ;
const users = require('./routes/users');
const auth = require('./routes/auth');
const gameServices = require("./services/games");
const userServices = require("./services/users");
const bodyParser = require('body-parser');
const mongoose = require('./configs/mongo'); //database configuration
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken');
const middleware = require('./middleware/jwtUtils');

const server = require("http").Server(app);
const io = require("socket.io")(server);
server.listen(4001);

app.set('secretKey', 'cora'); // jwt secret token

const { zeros } = require('mathjs');
var rows = 16, cols = 16;
var game_board = [];

app.use(cors());
// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error!'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function (req, res) {
    res.json({
        "tutorial": "Build REST API with node.js"
    });
});

// public route
app.use('/users', auth);
app.use('/users', middleware.validateUser, users);

// private route
// app.use('/movies', validateUser, movies);


//socket
io.use(function(socket,next){
    let token = socket.handshake.query.token;

    jwt.verify(token, app.get('secretKey'), function (err, decoded) {
        if (err) {
            return next(new Error('authentication error'));
        } else {

            return next();
        }
    });
});
io.on("connection",socket=>{
    console.log("Connect: "+ socket.id);

    io.to(socket.id).emit("socket-id-from-server",{socket_id: socket.id});

    socket.on("disconnect",()=>{
        console.log('Disconnect: '+socket.id);
    });

    socket.on("create-game-from-client", async function(message){
        try{
            let user = await gameServices.getUserInfo(message);

            if(parseInt(user.total_money)>=parseInt(message.bet_money)){
                
                let game = await gameServices.createGameInRedis(message);
                socket.join(game.id);

                io.to(message.socket_id).emit("create-game-from-server",{game_id: game.id, token: "vuong"});
                
            }
            else{
                io.to(message.socket_id).emit("fail-create-game-from-server",{status:"error"});
            }      
        }
        catch(err){
            io.to(message.socket_id).emit("fail-create-game-from-server",{status:"error"});
        }
    });

    socket.on("join-game-from-client",async function(message){
        try{
            let flag = await gameServices.checkGameNotReady(message);
            
            if(flag==true){

                let game = await gameServices.updateOpponentGameInRedis(message);

                if(game!=null){
                    socket.join(game.id);

                    game_board[game.id]=zeros([parseInt(rows),parseInt(cols)]);

                    io.to(game.id).emit("join-game-from-server",{               status:"ok",
                        game_id: game.id,
                        host: game.host,
                        host_name: game.host_name,
                        opponent: game.opponent,
                        opponent_name: game.opponent_name,
                        bet_money: game.bet_money    
                    });
                }

                else{
                    io.to(message.socket_id).emit("join-game-from-server",{status:"same"});
                }
            }
            else{

                io.to(message.socket_id).emit("join-game-from-server",{status:"full"});
            }
        }
        catch(err){
            io.to(message.socket_id).emit("join-game-from-server",{status:"error"});
        }
    });

    socket.on("chat-game-from-client", function(message){
        io.to(message.game_id).emit("chat-game-from-server",message);
    });

    socket.on("play-game-from-client", async function(message){
        let x = message.x;
        let y = message.y;

        if(game_board[message.game_id][x][y]>0){
            io.to(message.socket_id).emit("play-game-from-server",{
                status: "wrong position"
            });
        }
        else{
            try{
                let game = await gameServices.isAllowTurnGame(message);
                let result = [];
                let myturn = 1;
                if(game!=null){
                    if(game.turn=="X"){
                        game_board[message.game_id][x][y] = 1;
                    }
                    else{
                        game_board[message.game_id][x][y] = 2;
                        myturn = 2;
                    }
                    result = gameServices.checkWin( game_board[message.game_id], x, y, myturn);
                    
                    testDraw =  game_board[message.game_id].map(function(row){
                        return row.join("");
                    }).join("");
                    let isNotDraw = new RegExp('0').test(testDraw);

                    let newGame = await gameServices.setNewInfoGame(game, result, isNotDraw, false);
                    
                    if(newGame.result!=""){
                        delete game_board[message.game_id];
                        io.to(message.game_id).emit("play-game-from-server",JSON.stringify({
                            status: "end game",
                            info: newGame,
                            result: result,
                            x: message.x,
                            y: message.y
                        }));
                    }
                    else{
                        io.to(message.game_id).emit("play-game-from-server",JSON.stringify({
                            status: "continue game",
                            info: newGame,
                            x: message.x,
                            y: message.y
                        }));
                    }
                }
                else{
                    console.log("Not turn");
                    io.to(message.socket_id).emit("play-game-from-server",{
                        status: "wrong turn"
                    });
                }
            }
            catch(err){
                io.to(message.socket_id).emit("play-game-from-server",{
                    status: "error"
                });
            }
        }
    });

    socket.on("ignore-game-from-client", async function(message){
        try{
            let game = await gameServices.isAllowTurnGame(message);
            if(game!=null){
                let newGame = await gameServices.setNewInfoGame(game,[1],true, true)

                io.to(message.game_id).emit("ignore-game-from-server",JSON.stringify({
                    status: "ignore game",
                    info: newGame
                }));
            }
            else{
                io.to(message.socket_id).emit("ignore-game-from-server",{
                    status: "wrong turn"
                });
            }
            
        }
        catch(err){
            io.to(message.socket_id).emit("ignore-game-from-server",{
                status: "error"
            });
        }
    });

    socket.on("remove-game-from-client", async function(message){
        try{
            await gameServices.cancelGameInRedis(message);
        }
        catch(err){
            io.to(message.socket_id).emit("fail-remove-game-from-client",{status:"error"});
        }
    });

    setInterval(async function(){

        var res;
        try{
            var list = await gameServices.getGameNotReady();

            res = {
                list: list
            };
            //console.log(list);
        }
        catch(err){
            res = {status: "error"};
        }
        
        socket.broadcast.emit("load-game-from-server",JSON.stringify(res));
    },2000);
    
});


//_(board).map(function (row) {return row.join("")}).join("x").test(/(b{5,5})|(w{5,5})/);
//array[0].map((col, i) => array.map(row => row[i]));


// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function (err, req, res, next) {
    console.log(err);
    if (err.status === 404)
        res.status(404).json({
            message: "Not found"
        });
    else
        res.status(500).json({
            message: "Something looks wrong!"
        });
});

app.listen(5000, function () {
    console.log('Node server listening on port 5000');
});