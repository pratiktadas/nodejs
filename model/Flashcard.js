var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlashcardSchema = new Schema({
    "type" : { type : String },
    "name" : { type : String },
    "user" : { 
        type : Schema.Types.ObjectId, 
        ref : 'usercollection'
    }
});

var Flashcard = mongoose.model('flashcardcollection', FlashcardSchema);

module.exports = Flashcard;