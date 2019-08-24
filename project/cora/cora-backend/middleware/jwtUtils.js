var jwt = require('jsonwebtoken');
var secret = require('../configs/secret');

function validateUser(req, res, next) {
    jwt.verify(req.headers['token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({
                status: "error",
                message: err.message,
                data: null
            });
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            req.body.username = decoded.username;
            next();
        }
    });
}

module.exports = {
    validateUser: validateUser
}