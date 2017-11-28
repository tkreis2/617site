const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
var mongoose = require('mongoose');
var user = require('../models/User');
var forum = require('../models/forum');
var userLog = require('../models/userlog');


/**
 * GET /
 * Group dash page.
 */


exports.index = (req, res, next) => {
    var thisuser = req.user;
  
    forum.find({groupID: thisuser.groupID}, function(err, forums){
      user.find({groupID: thisuser.groupID}, function(err, users){
        userLog.find({groupID: thisuser.groupID}, function(err, userLogs){
          res.render('groupdash', {
            thisuser: thisuser,
            forums: forums,
            users: users,
            userLogs: userLogs
        });
        });
      });
      }).sort({"createdAt": -1}); 
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

/**Post entry */
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

  /**Delete entry */
exports.postdeleteforumpost= (req, res) => {
  var thisuser = req.user;
  var forumpostid = req.body.ObjectId || req.query.ObjectId;
  console.log(forumpostid);
  forum.findOneAndRemove({ObjectId: forumpostid}, function (err, forum){
    if(err)
      res.send(err);
    req.flash('success', { msg: 'Post Deleted.' });
    res.redirect('/groupdash');       
  })
};