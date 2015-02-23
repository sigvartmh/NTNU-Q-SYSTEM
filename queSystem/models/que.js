var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var QueSchema = new Schema({
    workbench: String,
    user: User
});


module.exports = mongoose.model('Que', QueSchema);
