var express = require('express');
var router = express.Router();
var multer_Data = require('./multerUpload.js');
var passport = require('passport');
var path = require('path');

router.get('/secret', ensureAuthenticated, function(req, res) {
  res.send('in')
});

router.get('/', function(req, res) {
  var username;
  if (req.user) {
      username = req.user.username
  } else {
      username = 'no user';
  }
  res.render(path.resolve('./', './views/html/index.html'), {user: username});
});

router.get('/login', function(req, res) {
  res.render(path.resolve('./', './views/html/login.html'));
});

router.get('/upload', function(req, res) {
  res.send('in');
});

router.post('/uploadedImage', multer_Data.upload.any(), function(req, res, next) {
	res.send(req.files);
});

//figure out how to export the ensureAuth function

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/')
    }
}

module.exports = router;