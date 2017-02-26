module.exports = {
  startMongoose: function() {
	var mongoose = require('mongoose');
    mongoose.Promise = global.Promise;
	mongoose.connect('mongodb://memer:whee1234@ds143449.mlab.com:43449/mememrepo');
  }
};