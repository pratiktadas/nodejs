var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/nodetest1');

module.exports = db;