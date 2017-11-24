const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
var mongoose = require('mongoose');
var user = require('../models/User');
var forum = require('../models/forum');


// exports.getforum = (req, res) => {
//     var thisuser = req.user;
//     forum.find({groupID: thisuser.groupID}, function(err, forums){
//         res.render('forum', {
//             forums: forums  
//         });
//     });
// };

// exports.postforum = (req, res) => {
//     var thisuser = req.user;
  
//     const errors = req.validationErrors();
  
//     if (errors) {
//       req.flash('errors', errors);
//       return res.redirect('/groupdash');
//     }
  
//     var newUserLog = new userlog({email: thisuser.email, groupID: thisuser.groupID, individGoalValue: req.body.LogGoal, logentry :{logDate: req.body.LogDateTime, logType: req.body.logtype, logDetails: req.body.LogDetails, individGoalProgress: req.body.LogProgress, picture: req.body.LogImage}});
  
//     newUserLog.calcProg(req.body.LogGoal, req.body.LogProgress);
  
//     newUserLog.markModified('logentry');
//     newUserLog.save(function(err, userlog){
//       if(err)
//         res.send(err);
//       req.flash('success', { msg: 'Success! Entry Added.' });
//       res.redirect('/account');        
//       // res.json(userlog);
//     });
  
//   };

