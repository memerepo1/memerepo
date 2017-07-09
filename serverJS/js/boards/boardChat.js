module.exports = function(io) {
    var path = require('path');
    var database = require(path.resolve('./', './serverJS/js/databaseMongoose/mongooseVar.js'));
    var allClients = [];
    io.on('connection', function(socket) {
        allClients.push(socket.id);
        socket.emit('socketid', socket.id);
        socket.on('disconnect', function() {
            var i = allClients.indexOf(socket.id);
            allClients.splice(i, 1);
        });
        socket.on('message', function(data) {
            var tryKey = data.tryKey
            var message = data.message
            var user = data.user
            var room = data.url
            console.log(data.message);
            socket.join(room);
            database.BoardAuthentication.findOne({
                $and: [{
                    'username': {
                        '$regex': data.user,
                        '$options': 'i'
                    }
                }, {
                    'sessionID': {
                        '$regex': data.tryKey,
                        '$options': 'i'
                    }
                }]
            }, function(err, sessionMatch) {
                if (sessionMatch) {
                    io.to(room).emit('allUsersMessage', {message : message, user : user});
                    console.log('this socket is authenticated proceed to send data to all other sockets under username')
                } else {
                    console.log('this is from a bogus socket end now and log them out of whatever account they are in');
                }
                if (err) {
                    return done(err);
                }
            });
        });
    });
};