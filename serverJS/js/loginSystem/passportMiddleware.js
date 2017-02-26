module.exports = {
    passportMiddleware: function() {
    	var passport = require('passport');
		var LocalStrategy = require('passport-local').Strategy;
        var path = require('path')
        var database = require(path.resolve('./', './serverJS/js/databaseMongoose/mongooseVar.js'));
        var bcrypt = require('bcryptjs');
        passport.use(new LocalStrategy(function(username, password, done) {
            process.nextTick(function() {
                database.User.findOne({
                    'username': username,
                }, function(err, user) {
                    if (err) {
                        return done(err);
                    }

                    if (!user) {
                        return done(null, false);
                    }

                    var result = bcrypt.compareSync(password, user.password);

                    if (result) {
                        return done(null, user);
                    } else {

                        return done(null, false);
                    }

                });
            });
        }));

        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        passport.deserializeUser(function(user, done) {
            done(null, user);
        });

    }
};

