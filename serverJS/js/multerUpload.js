var path = require('path');
var multer = require('multer');

var storage_upload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({
    storage: storage_upload,
    fileFilter: function(req, file, cb) {
        if (path.extname(file.originalname) !== '.png') {
            return cb(new Error('not so fast'));
        }

        cb(null, true)
    }
});

module.exports = {
	upload
};