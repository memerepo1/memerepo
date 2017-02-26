var express = require('express');
var router = express.Router();
var path = require('path');
var database = require(path.resolve('./', './serverJS/js/databaseMongoose/mongooseVar.js'));

router.post("/boardCreate", function(req, res) {
    var boardDetails = database.Boards({
        boardName: req.body.boardName
    });
    database.Boards.findOne({
        'boardName': req.body.boardName
    }, function(err, board) {
        if (board) {
            // send a message to the user that board is taken
        } else {
            if (!err) {
                boardDetails.save(function(err) {
                    //later minimize the room it takes up on the database to store board data
                    if (err) throw err;
                    res.redirect('/board')
                });
            } else {
                console.log(err)
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

router.get('/b/:boardName', function(req, res) {
    database.Boards.findOne({
        'boardName': req.url.substring(3)
    }, function(err, board) {
        if (board) {
            res.render(path.resolve('./', './views/html/boardTemplate.html'));
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