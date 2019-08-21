const redisClient = require('../configs/redis').client;
const userModel = require('../models/users');

async function findExistUser(username){
    return new Promise(function(resolve, reject){
        let key = "users:username:"+username;
        
        try{
            let value = await redisClient.sinter(key);

            if(value.length==0){
                let user = await userModel.findOne({username: username}).exec();

                if(!user){
                    resolve(null);
                }
                else{
                    await redisClient.sadd("users:username:"+username,user._id);

                    await redisClient.hmset("users:"+user._id,{
                        id: user._id,
                        username: username,
                        total_money: user.total_money,
                        win_count: user.win_count,
                        total_count: user.total_count
                    });

                    resolve(user);
                }
            }
            else{
                let id = res[0];
                let user = userModel.findById(id).exec();
                if(!user){
                    resolve(null);
                }
                else{
                    resolve(user);
                }
            }
        }
        catch(err){
            reject(err);
        }

    });
}

module.exports = {
    findExistUser: findExistUser
}