const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
var mongoose = require('mongoose').set('debug', true);
var userlog = require('../models/userlog');
var user = require('../models/User');
var multer = require('multer');
var mongoresults = [];
var reset = false;


/**
 * GET /
 * Individ Dash page.
 */
exports.index = (req, res) => {
  var thisuser = req.user;
  if (reset === true){
    thisuser.progper = 0;
    reset = false;
  }
  else{
    // thisuser.progper = (thisuser.totalGoalProgress/thisuser.totalGoalValue) * 100;
    thisuser.progper = (thisuser.thisgoalprogress/thisuser.individGoal) * 100;    
  }
  userlog.find({email: thisuser.email, groupID: thisuser.groupID}, function(err, userLogs){
    res.render('individdash', {
      userLogs: userLogs,  
      thisuser: thisuser,
    });
  }).sort({"logentry.logDate": -1});

};


exports.postresetGoal = (req, res) => {
  var thisuser = req.user;

  user.findOneAndUpdate({email:thisuser.email, groupID: thisuser.groupID},{individGoal: req.body.goalupdate, 
    '$inc': {totalGoalValue: req.body.goalupdate}, completions: thisuser.completions +1, thisgoalprogress: 0,
  thisgoalremaining:req.body.goalupdate, progper: 0}, {new: true}, function (err, user){
      if(err)
        res.send(err);
      reset = true;
      req.flash('success', { msg: 'Goal Reset.' });
      res.redirect('/account');       
  })
};

exports.postresetCompletions = (req, res) => {
  var thisuser = req.user;

  user.findOneAndUpdate({email:thisuser.email, groupID: thisuser.groupID},{completions: 0}, {new: true}, function (err, user){
    if(err)
      res.send(err);
    req.flash('success', { msg: 'Completions Reset.' });
    res.redirect('/account');        
  })
};

exports.postlogentry = (req, res) => {
  var thisuser = req.user;
  var uploading = multer({
    dest: __dirname +'uploads',
    limits: {fileSize: 1000000, files:1},
  })

  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  var newUserLog = new userlog({email: thisuser.email, groupID: thisuser.groupID, 
    logentry :{logDate: req.body.LogDateTime, logType: req.body.logtype, logDetails: req.body.LogDetails, individGoalProgress: req.body.LogProgress, picture: req.body.LogImage}});

  newUserLog.calcProg(thisuser);

  thisuser.markModified('totalGoalProgress');
  thisuser.save(function(err, user){
    if(err)
      res.send(err);

  });
  newUserLog.markModified('logentry');
  newUserLog.save(function(err, userlog){
    if(err)
      return res.send(err);
    req.flash('success', { msg: 'Success! Entry Added.' });
    res.redirect('/account');        
    // res.json(userlog);
  });
};

/**Get Edit an Entry Page*/
exports.geteditentry = (req, res) => {
  // var thisuser = req.user;
  res.render('editentry');

  // userlog.find({email: thisuser.email, groupID: thisuser.groupID}, function(err, userLogs){
  //   res.render('editentry', {
  //     userLogs: userLogs,  
  //     thisuser: thisuser,
  //   });
  // });
};

/**Post edit entry */
exports.posteditentry = (req, res) => {
  var thisuser = req.user;

  userlog.findOneAndUpdate({email: thisuser.email, groupID: thisuser.groupID},{logentry :{logDate: req.body.editedLogDateTime, logType: req.body.editedlogtype, 
    logDetails: req.body.editedLogDetails, individGoalProgress: req.body.editedLogProgress, picture: req.body.editedLogImage}}, {new: true}, function (err, userlog){
    if(err)
      res.send(err);
    req.flash('success', { msg: 'Entry Updated.' });
    res.redirect('/account');        
  })
  // userlog.findByIdAndUpdate(userlog.id, function(err, userlog){
  //   logentry.logDate= req.body.editedLogDateTime,
  //   logentry.logType= req.body.editedlogtype, 
  //   logentry.logDetails= req.body.editedLogDetails, 
  //   logentry.individGoalProgress=req.body.editedLogProgress,
  //   logentry.picture= req.body.editedLogImage;

  //   userlog.save(function(err, updatedlog){
  //     if (err) return res.send(err);
  //     req.flash('success', { msg: 'Success! Entry Added.' });
  //     res.redirect('/account');  
  //   });
  // });

};


/**Delete entry */
exports.postdeleteentry = (req, res) => {
  var thisuser = req.user;
  var entryid = req.body.ObjectId || req.query.ObjectId;

  userlog.findOneAndRemove({ObjectId: entryid}, function (err, userlog){
    if(err)
      res.send(err);
    req.flash('success', { msg: 'Entry Deleted.' });
    res.redirect('/account');       
  })
};


/**Change user's group */
exports.postnewgroup = (req, res) => {
  var thisuser = req.user;

  user.findOneAndUpdate({email:thisuser.email, groupID: thisuser.groupID},{individGoal: req.body.goalvalue, completions: 0, groupID: req.body.groupname, 
    joinstart: req.body.joinstart}, {new: true}, function (err, user){
    if(err)
      res.send(err);
    req.flash('success', { msg: 'Group Information Updated.' });
    res.redirect('/account');        
  })
};


/**Change user's group */
exports.getnewgroup = (req, res) => {
  res.render('newgroup');
};
