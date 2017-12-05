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
var fs = require('fs'); /** */


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
  }).single(req.body.LogImage);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

   var newUserLog = new userlog({email: thisuser.email, groupID: thisuser.groupID, 
    logentry :{logDate: req.body.LogDateTime, logType: req.body.logtype, 
      logDetails: req.body.LogDetails, individGoalProgress: req.body.LogProgress,
    picture: req.body.LogImageURL}});


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
exports.geteditentry = (req, res, next) => {
  var thisuser = req.user;
  var logID = req.params.logID;

  // userlog.findById(logID, function(err, userlog){
  //   res.render('editentry', {
  //     logID: userlog.id, 
  //     thisuser: thisuser,
  //   });
  // });
  res.render('editentry',{
    logID: logID,
  });
  return next();
};


/**Post edit entry */
exports.posteditentry = (req, res) => {
  var thisuser = req.user;
  var logID = req.params.logID;

  // console.log('logID in posteditentry: ' +logID);
  userlog.findById(logID, function (err, userlog){
    user.findOneAndUpdate({email:thisuser.email, groupID: thisuser.groupID},{totalGoalProgress: thisuser.totalGoalProgress - userlog.logentry.individGoalProgress, 
      thisgoalprogress: thisuser.thisgoalprogress - userlog.logentry.individGoalProgress,
      thisgoalremaining: thisuser.thisgoalremaining + userlog.logentry.individGoalProgress, progper: (thisuser.thisgoalprogress - userlog.logentry.individGoalProgress)/ (thisuser.thisgoalprogress + thisuser.thisgoalremaining)}, 
      {new: true}, function (err, user){
          if(err)
            res.send(err); 
      });  
    if(err)
      res.send(err);       
   });
   userlog.findByIdAndUpdate(logID, {logentry:{logDate: req.body.editedLogDateTime, logType: req.body.editedlogtype, logDetails: req.body.editedLogDetails, 
    individGoalProgress: req.body.editedLogProgress, individGoalRemaining: thisuser.individGoal - req.body.editedLogProgress}}, {new: true}, function(err, userlog){
      // user.findOneAndUpdate({email:thisuser.email, groupID: thisuser.groupID}, {totalGoalProgress: thisuser.totalGoalProgress + userlog.logentry.individGoalProgress, 
      //   thisgoalprogress: thisuser.thisgoalprogress + userlog.logentry.individGoalProgress,
      //   thisgoalremaining: thisuser.thisgoalremaining - userlog.logentry.individGoalProgress, progper: (thisuser.thisgoalprogress/ (thisuser.thisgoalprogress + thisuser.thisgoalremaining))}, 
      //   {new: true}, function (err, user){
      //       if(err)
      //         return (err);                           
      //   });   
      if (err)
        return (err);
  });
     
//  });      

  //  res.redirect('/account');
  res.redirect('/updateuser&userid='+ thisuser.id + '&logid='+logID);
    
}; //end posteditentry

exports.updateentry = (req, res) => {
  var thisuser = req.user;
  var logID = req.params.logID;
  console.log('reached updateentry');
  console.log('editedProgress: '+ req.body.editedLogProgress);

    userlog.findById(logID, function(err, userlog){
      user.findOneAndUpdate({email:thisuser.email, groupID: thisuser.groupID}, 
        {totalGoalProgress: thisuser.totalGoalProgress + userlog.logentry.individGoalProgress, 
            thisgoalprogress: thisuser.thisgoalprogress + userlog.logentry.individGoalProgress,
            thisgoalremaining: thisuser.thisgoalremaining - userlog.logentry.individGoalProgress, progper: (thisuser.thisgoalprogress/ (thisuser.thisgoalprogress + thisuser.thisgoalremaining))}, 
            {new: true}, function (err, user){
                if(err)
                  return (err);                           
            });    
    }); 
    req.flash('success', {msg: 'Entry Updated.'});
    res.redirect('/account');       
};


/**Post Delete entry */
exports.postdeleteentry = (req, res) => {
  var thisuser = req.user;
  var logID = req.params.logID;
  var amount;


  userlog.findByIdAndRemove(logID, function (err, userlog){
    // amount = userlog.logentry.individGoalProgress;
    console.log('in delete amount: ' +amount);
    user.findOneAndUpdate({email:thisuser.email, groupID: thisuser.groupID},{totalGoalProgress: thisuser.totalGoalProgress - userlog.logentry.individGoalProgress, 
      thisgoalprogress: thisuser.thisgoalprogress - userlog.logentry.individGoalProgress,
      thisgoalremaining: thisuser.thisgoalremaining + userlog.logentry.individGoalProgress, progper: thisuser.thisgoalprogress/ (thisuser.thisgoalprogress + thisuser.thisgoalremaining)}, 
      {new: true}, function (err, user){
          if(err)
            res.send(err);  
      });
               
    if(err)
      res.send(err);    
  });
  // userlog.findOneAndUpdate({_id:{$gt: logID}}, 
  //   {logentry:{individGoalRemaining: thisuser.thisgoalremaining}},
  //   {new: true}, function (err, userlog){
  //     if(err)
  //     res.send(err);    
  //   });

  req.flash('success', { msg: 'Entry Deleted.' });
  res.redirect('/account');  
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
