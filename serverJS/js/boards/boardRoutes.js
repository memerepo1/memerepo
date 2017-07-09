var express = require('express');
var router = express.Router();
var path = require('path');
var async = require('async');
var database = require(path.resolve('./', './serverJS/js/databaseMongoose/mongooseVar.js'));

router.post("/boardCreate", function(req, res) {
    var boardDetails = database.Boards({
        boardName: req.body.boardName
    });
    var newBoardDetails = database.NewBoards({
        boardName: req.body.boardName
    });
    database.Boards.findOne({
        'boardName': req.body.boardName
    }, function(err, board) {
        if (board) {
            res.redirect('/board')
        } else {
            if (!err) {
                var mongooseSave = [boardDetails, newBoardDetails];
                async.eachSeries(mongooseSave, function(mongooseSaveR, asyncdone) {
                    if (mongooseSaveR === boardDetails) {
                        mongooseSaveR.save(asyncdone);
                    } else if (mongooseSaveR === newBoardDetails) {

                        database.NewBoards.findOneAndUpdate({
                            _id: '58b3dab2a060011d8465571d'
                        }, {
                            $addToSet: {
                                boardName: req.body.boardName
                            },
                        }, function(err, data) {
                            if (data.boardName.length > 2) {
                                database.NewBoards.findOneAndUpdate({
                                    _id: '58b3dab2a060011d8465571d'
                                }, {
                                    $pop: {
                                        boardName: -1
                                    },
                                }, asyncdone, function(err, data) {

                                });
                            } else {}
                        });


                    } else {
                        console.log(err);
                    }
                }, function(err) {
                    if (err) return console.log(err);
                });
                res.redirect('/board')
            } else {
                console.log(err);
            }
        }
        if (err) {
            return done(err);
        }
    });
});

router.get('/board', ensureAuthenticated, function(req, res) {
    res.render(path.resolve('./', './views/html/board.html'));
});

router.get('/b/:boardName', ensureAuthenticated, function(req, res) {
    database.Boards.findOne({
        'boardName': req.url.substring(3)
    }, function(err, board) {
        if (board) {

            res.render(path.resolve('./', './views/html/boardTemplate.html'), {
                key: req.sessionID,
                user: req.user.username,
                url: req.url.substring(3)
            });

            var boardSessionsDetails = database.BoardAuthentication({
                username: req.user.username,
                sessionID: req.sessionID
            });

            database.BoardAuthentication.findOne({
                'username': req.user.username,
                'sessionID': req.sessionID
            }, function(err, session) {
                if (session) {
                    console.log('session already exists')
                } else {
                    if (!err) {
                        boardSessionsDetails.save(function(err) {
                            if (err) throw err;
                        });

                    } else {
                        console.log(err);
                    }
                }
            });

            if (err) {
                return done(err);
            };
        } else {
            if (!err) {
                res.send('This board does not exist. Go away.');
            } else {
                console.log(err)
            }
        }
        if (err) {
            return done(err);
        }
    });
});


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/')
    }
}

module.exports = router;