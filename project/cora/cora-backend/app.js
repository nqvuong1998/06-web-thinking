const express = require('express');
const logger = require('morgan');
//const movies = require('./routes/movies') ;
const users = require('./routes/users');
const bodyParser = require('body-parser');
const mongoose = require('./configs/mongo'); //database configuration
const cors = require('cors');
const app = express();


app.set('secretKey', 'cora'); // jwt secret token

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
app.use('/users', users);

// private route
// app.use('/movies', validateUser, movies);



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