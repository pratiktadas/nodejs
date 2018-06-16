var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserContactSchema = new Schema({
    "user_id" : {
        type: Schema.Types.ObjectId,
        ref: 'usercollection'
    },
    "mobile_number" : { type: Number },
    "home_number" : { type: Number },
    "office_number" : {type: Number},
    "comment": { type : String }
    //,
    // "user" : {
    //     type: Schema.Types.ObjectId,
    //     ref: 'usercollection'
    // }
});

var UserContact = mongoose.model("usercontactcollection", UserContactSchema);
module.exports = UserContact;