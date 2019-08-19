const userModel = require('../models/users');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

module.exports = {
 create: function(req, res, next) {
     console.log(req.body.password);
  userModel.create({ username: req.body.username, password: req.body.password }, function (err, result) {
      if (err) {
        next(err);
      }
      else{
        res.json({status: "success", message: "User added successfully!!!", data: null});
      }
       
    });
 },

authenticate: function(req, res, next) {
userModel.findOne({username:req.body.username}, function(err, userInfo){
    if (err) {
        res.json({status: "vvv"});
        next(err);
    } else {

        if(!userInfo){
            res.json({status:"error", message: "Invalid username!!!", data:null});
        }
        else{
            if(bcrypt.compareSync(req.body.password, userInfo.password)) {

                const token = jwt.sign({id: userInfo._id, username: userInfo.username}, req.app.get('secretKey'), { expiresIn: '24h' });
                    
                res.json({status:"success", message: "user found!!!", data:{user: userInfo, token:token}});
            }
            else{
                res.json({status:"error", message: "Invalid password!!!", data:null});
            }
        }
    }
    });
 },
}