var mongoose = require('mongoose');
var user = require('../models/User');
var Schema = mongoose.Schema;

var userlogSchema = Schema({
    email: String, 
    groupID: String,
    // individGoalType: String,
    // individGoalValue: Number,
    // individGoalProgress: Number,
    // totalGoalProgress: Number,

    logentry: {
        logDate: String,
        logType: String,
        logDetails: String,
        individGoalProgress: {type: Number, default: 0},
        individGoalRemaining: Number,
        picture: String
    }
});

userlogSchema.methods.calcProg = function calcProg(individGoal, individGoalProgress){
    user.totalGoalProgress = user.totalGoalProgress + this.logentry.individGoalProgress;
    this.logentry.individGoalRemaining = user.individGoal - this.logentry.individGoalProgress;
}

userlogSchema.pre('save', function (next) {
    const userlog = this;
    if (!userlog.isModified()) { return next(); }
    next ();
});



var userlog = mongoose.model('userlog', userlogSchema);

module.exports= userlog;
