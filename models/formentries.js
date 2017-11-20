var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var formentrySchema = Schema({
    fullname: String, 
    email: String, 
    reasoncontact: String,
    message: String
});

var formentry = mongoose.model('formentry', formentrySchema);
module.exports=formentry;
