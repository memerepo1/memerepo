var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/views/html'));

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function (req, res) {
    var result = 'App is running'
    res.send(result);
    res.render('./views/html/index.html');
}).listen(app.get('port'), function () {
    console.log('App is running, server is listening on port ', app.get('port'));
});

