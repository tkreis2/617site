var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userlogSchema = Schema({
    email: String, 
    groupID: String,
    individGoalType: String,
    individGoalValue: Number,
    // individGoalProgress: Number,

    logentry: {
        logDate: String,
        logType: String,
        logDetails: String,
        individGoalProgress: Number,
        individGoalRemaining: Number,
        picture: String
    }
});

userlogSchema.methods.calcProg = function calcProg(individGoalValue, individGoalProgress){
    this.individGoalRemaining = this.individGoalValue - this.individGoalProgress;
}

userlogSchema.pre('save', function (next) {
    const userlog = this;
    if (!userlog.isModified()) { return next(); }
    next ();
});



var userlog = mongoose.model('userlog', userlogSchema);

module.exports= userlog;
