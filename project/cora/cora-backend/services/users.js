const redisClient = require('../configs/redis').client;
const userModel = require('../models/users');

function findExistUser(username){
    return new Promise(async function(resolve, reject){
        let key = "users:username:"+username;
        
        try{
            let value = await redisClient.sinter(key);

            if(value.length===0){

                let user = await userModel.findOne({username: username}).exec();

                if(!user){
                    //return null;
                    resolve(null);
                }
                else{
                    await redisClient.sadd("users:username:"+username,user._id.toString());

                    //get games???
                    //let games = [];
                    //games = await userModel.find().populate('games');

                    //???
                    await redisClient.hmset("users:"+user._id.toString(),{
                        id: user._id,
                        username: username,
                        total_money: user.total_money,
                        win_count: user.win_count,
                        total_count: user.total_count,
                        //games: games
                    });
                    //return user;
                    resolve(user);
                }
            }
            else{
                let id = value[0];

                let user = await userModel.findById(id).exec();

                if(!user){
                    //return null;
                    resolve(null);
                }
                else{
                    //return user;
                    resolve(user);
                }
            }
        }
        catch(err){
            //return err;
            reject(err);
        }

    });
}

// function setUserOnline(user_id){
//     return new Promise(async function(resolve,reject){
//         try{
//             let value = await redisClient.get("online:"+user_id);
//             if(value){
//                 resolve(false);
//             }
//             else{
//                 await redisClient.set("online:"+user_id,"true");
//                 resolve(true);
//             }
//         }
//         catch(err){
//             reject(err);
//         }
//     });
// }

// function setUserOffline(user_id){
//     return new Promise(async function(resolve,reject){
//         try{
//             let value = await redisClient.get("online:"+user_id);
//             if(value){
//                 await redisClient.del("online:"+user_id);
//                 resolve(true);
//             }
//             else{
//                 resolve(false);
//             }
//         }
//         catch(err){
//             reject(err);
//         }
//     });
// }

module.exports = {
    findExistUser: findExistUser
}