var express = require('express')
var app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

server.listen(process.env.PORT || 5000);