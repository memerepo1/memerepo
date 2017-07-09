var express = require('express');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var session = require('express-session');
var bcrypt = require('bcryptjs');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var lsystem = express.Router();
var path = require('path');
var database = require(path.resolve('./', './serverJS/js/databaseMongoose/mongooseVar.js'));

lsystem.use(bodyParser.urlencoded({
    extended: true
}));

lsystem.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoRemove: 'native',
        ttl: 14 * 24 * 60 * 60
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    maxAge: null
}));


// Init passport authentication 
lsystem.use(passport.initialize());
// persistent login sessions 
lsystem.use(passport.session());

lsystem.use('/logout', function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/login');
    });
});

lsystem.post('/signin', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/login');
        }

        req.login(user, function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    })(req, res, next);
});

lsystem.post('/signup', function(req, res) {
    var userDetails = database.User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password1, bcrypt.genSaltSync(10))
    });

    database.User.findOne({
        $or: [{
            'username': {
                '$regex': req.body.username,
                '$options': 'i'
            }
        }, {
            'email': {
                '$regex': req.body.email,
                '$options': 'i'
            }
        }]
    }, function(err, user) {
        if (user) {

        } else {
            req.login(userDetails, function(err) {
                if (!err) {
                    userDetails.save(function(err) {
                        if (err) throw err;
                        res.redirect('/login')
                    });
                } else {
                    console.log(err)
                }
            })
        }
        if (err) {
            return done(err);
        }
    });
});

module.exports = lsystem;