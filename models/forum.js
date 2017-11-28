const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

const forumSchema = Schema({
    groupID: String,
    email: String,
    message: String,
  }, { timestamps: true });


//   forumSchema.methods.getforumposts = function getforumposts(cb){
//     return this.model('forum').find({groupID: this.groupID}, cb);
// }

var forum = mongoose.model('forum', forumSchema);

module.exports = forum;
  