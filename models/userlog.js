var mongoose = require('mongoose');
var user = require('../models/User');
var Schema = mongoose.Schema;

var userlogSchema = Schema({
    email: String, 
    groupID: String,
    logentryID: String,


    logentry: {
        logDate: String,
        logType: String,
        logDetails: String,
        individGoalProgress: {type: Number, default: 0},
        // thisgoalprogress: {type: Number, default: 0},
        individGoalRemaining: Number,
        picture: String,
        // picture: {data: Buffer, contentType: String}
    }
});

userlogSchema.methods.calcProg = function calcProg(thisuser){
    thisuser.thisgoalprogress = thisuser.thisgoalprogress + this.logentry.individGoalProgress;
    thisuser.totalGoalProgress = thisuser.totalGoalProgress + this.logentry.individGoalProgress;
    thisuser.thisgoalremaining = thisuser.individGoal - thisuser.thisgoalprogress;
    this.logentry.individGoalRemaining = thisuser.individGoal - thisuser.thisgoalprogress;
}

userlogSchema.methods.updateProg = function updateProg(thisuser, prevVal, editedLogProgress){
    thisuser.thisgoalprogress = thisuser.thisgoalprogress - prevVal + this.logentry.editedLogProgress;
    thisuser.totalGoalProgress = thisuser.totalGoalProgress + thisuser.thisgoalprogress;
    thisuser.thisgoalremaining = thisuser.individGoal - thisuser.thisgoalprogress;
    this.logentry.individGoalRemaining = thisuser.individGoal - thisuser.thisgoalprogress;
}

// userlogSchema.statics.deleteProg = function deleteProg(thisuser){
//     console.log("in userlog schema delete");
//     thisuser.thisgoalprogress = thisuser.thisgoalprogress - this.logentry.individGoalProgress;
//     thisuser.totalGoalProgress = thisuser.totalGoalProgress - this.logentry.individGoalProgress;
//     thisuser.thisgoalremaining = thisuser.individGoal + this.logentry.individGoalProgress;
// }

userlogSchema.pre('save', function (next) {
    const userlog = this;
    if (!userlog.isModified()) { return next(); }
    next ();
});



var userlog = mongoose.model('userlog', userlogSchema);

module.exports= userlog;
