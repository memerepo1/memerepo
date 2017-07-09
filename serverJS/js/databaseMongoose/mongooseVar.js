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
    boardName: String
});
var boardSession = mongoose.Schema({
    username: String,
    sessionID: String
});
var newBoardSchema = mongoose.Schema({
    boardName: [{ }]
});
var User = mongoose.model('User', userDetailSchema, "MongoStore");
var Boards = mongoose.model('Boards', board, 'boards');
var NewBoards = mongoose.model('NewBoards', newBoardSchema, 'newBoards');
var BoardAuthentication = mongoose.model('BoardAuthentication', boardSession, 'boardAuthentication');
//why are you exporting the schemas?
module.exports = {
	userDetailSchema,
	board,
	newBoardSchema,
	boardSession,
	User,
	Boards,
	NewBoards,
	BoardAuthentication
};