var express = require('express');
var path = require('path');
var routes = require('./serverJS/js/routes.js')
var login = require('./serverJS/js/loginSystem/passportPost.js');
var passport = require('./serverJS/js/loginSystem/passportMiddleware.js');
var mongoose = require('./serverJS/js/databaseMongoose/mongooseMain.js');
var boardroutes = require('./serverJS/js/boards/boardRoutes.js');
var ejs = require('ejs');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var boardchat = require('./serverJS/js/boards/boardChat.js')(io);
passport.passportMiddleware();
mongoose.startMongoose();
//put routes after login because isAuthenticated will always return false because of the passport session middlware
app.use('/', login, routes, boardroutes);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require("ejs").renderFile);
app.set('view engine', 'html');
http.listen(process.env.PORT || 3000);
module.exports = app