//var db = require('../database');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var relationship = require("mongoose-relationship");

/* Create User schema */
var UserSchema = new Schema({
    username : { type: String },
    email : { type: String },
    password : { type: String },
    status: {
        type: String,
        enum : ['active','inactive'],
        default: 'active'
    },
    user_contact: [{ type: Schema.Types.ObjectId, ref: 'usercontactcollection' }]
    //,
    //flashcard : [{ type: Schema.Types.ObjectId, ref: "flashcardcollection" }]
});
    
var User = mongoose.model('usercollection', UserSchema);
//var User = mongoose.model('usercollection', new Schema({ username: String, email: String, password: String}));
module.exports = User;