const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
var mongoose = require('mongoose');
var userlog = require('../models/userlog');
var user = require('../models/User');
var multer = require('multer');
var mongoresults = [];

/**
 * GET /
 * Individ Dash page.
 */
exports.index = (req, res) => {
  var thisuser = req.user;

  // var latestlog = userlog.findOne({email: thisuser.email, groupID: thisuser.groupID,}, function(err, userlog){
  // }).sort({"logentry:logDate": -1});
  userlog.find({email: thisuser.email, groupID: thisuser.groupID}, function(err, userLogs){
    res.render('individdash', {
      userLogs: userLogs,  
      thisuser: thisuser,
      // latestlog: latestlog,
    });
  }).sort({"logentry.logDate": -1});

};


exports.postresetGoal = (req, res) => {
  var thisuser = req.user;

  user.findOneAndUpdate({email:thisuser.email, groupID: thisuser.groupID},{individGoal: req.body.goalupdate, '$inc': {totalGoalValue: req.body.goalupdate}, completions: thisuser.completions +1}, {new: true}, function (err, user){
    // userlog.findOneAndUpdate({email: thisuser.email, groupID: thisuser.groupID}, {individGoalProgress: 0}, {new: true}, function(err, userlog){
      if(err)
        res.send(err);
      req.flash('success', { msg: 'Goal Reset.' });
      res.redirect('/account');  
    // })      
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
  // var storage = multer.diskStorage({
  //   destination: function (req, file, cb){
  //     cb(null, path.join(__dirname, 'uploads'))
  //   },
  //   filename: function (req, file, cb){
  //     cb(null, file.req.body.logentry.LogImage + '-'+ Date.now())
  //   }
  // })
  // var upload = multer ({
  //   storage: storage
  // }).single(req.body.logentry.LogImage)
  // upload(req, res, function(err){
  //   req.flash('success', {msg: 'File Uploaded.'})
  // })

  var uploading = multer({
    dest: __dirname +'uploads',
    limits: {fileSize: 1000000, files:1},
  })

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  var newUserLog = new userlog({email: thisuser.email, groupID: thisuser.groupID, individGoalValue: req.body.LogGoal, 
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
      res.send(err);
    req.flash('success', { msg: 'Success! Entry Added.' });
    res.redirect('/account');        
    // res.json(userlog);
  });

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
