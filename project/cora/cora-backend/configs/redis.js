// var redis = require('async-redis');
// var client = redis.createClient();

// client.on('connect', function() {
//     console.log('Redis client connected');
// });

// client.on('error', function (err) {
//     console.log('Something went wrong ' + err);
// });

const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
 
client.on("error", function (err) {
    console.log("Error " + err);
});
 
const asyncBlock = async () => {
  await client.set("string key", "string val");
  const value = await client.get("string key");
  console.log(value);
  await client.flushall("string key");
};

module.exports={
    client: client
}