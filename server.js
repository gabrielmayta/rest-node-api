// BASIC SETUP
// ==============================================
var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var app = express();

var server = http.createServer(app);
var io = socketio.listen(server);

var mongo = require('mongoose');
var nodebook_db = require('./config/database');

var port = process.env.PORT || 6969;

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var router = express.Router();
var cors = require('cors');

app.set('socketio', io);
app.set('server', server);

// DATABASE
// ==============================================
mongo.connect(nodebook_db.url);

// CONFIGURATION
// ==============================================
app.use(cors());
app.use(cors({credentials: true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());


// ROUTES
// ==============================================
require('./app/routes/usersRouter.js')(app, router);

// SERVER START
// ==============================================
server.listen(port);
console.log("Server is running on " + port);
