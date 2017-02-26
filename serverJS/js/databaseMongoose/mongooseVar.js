var mongoose = require('mongoose');
//why add this here? BELOW
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;
var userDetailSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
});
var board = mongoose.Schema({
    boardName: String,
});
var User = mongoose.model('User', userDetailSchema, "MongoStore");
var Boards = mongoose.model('Boards', board, 'boards');
module.exports = {
	userDetailSchema,
	board,
	User,
	Boards
};