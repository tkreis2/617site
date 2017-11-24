const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
var mongoose = require('mongoose');
var user = require('../models/User');
var forum = require('../models/forum');


/**
 * GET /
 * Group dash page.
 */


exports.index = (req, res, next) => {
    var thisuser = req.user;
  
    forum.find({groupID: thisuser.groupID}, function(err, forums){
      user.find({groupID: thisuser.groupID}, function(err, users){
        res.render('groupdash', {
          thisuser: thisuser,
          forums: forums,
          users: users
        });
      });
      }); 
  };




// exports.index = (req, res) => {

//   var thisuser = req.user;

//   forum.find({groupID: thisuser.groupID}, function(err, forums){
//     res.render('groupdash', {
//         title: 'Group Dashboard - HealthWe',
//         forums: forums,
//         thisuser: thisuser  
//     }); 
//   });
// };

// exports.getusers = (req, res) => {
//   var thisuser = req.user;

//   user.find({groupID: thisuser.groupID}, function(err, users){
//     res.render('groupdash', {
//       title: 'Group Dashboard - HealthWe',
//       users: users,
//       thisuser: thisuser
//     });
//   });
// };


exports.postforum = (req, res) => {
    var thisuser = req.user;
  
    const errors = req.validationErrors();
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/groupdash');
    }
  
    var newforumPost = new forum({email: thisuser.email, groupID: thisuser.groupID, message: req.body.forumpost});

    newforumPost.save(function(err, forum){
      if(err)
        res.send(err);
      req.flash('success', { msg: 'Success! Post Added.' });
      res.redirect('/groupdash');        
      // res.json(userlog);
    });
  
  };