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


/**Post entry */
exports.postforum = (req, res) => {
    var thisuser = req.user;
  
    // const errors = req.validationErrors();
  
    // if (errors) {
    //   req.flash('errors', errors);
    //   return res.redirect('/groupdash');
    // }
  
    var newforumPost = new forum({email: thisuser.email, groupID: thisuser.groupID, message: req.body.forumpost});

    newforumPost.save(function(err, forum){
      if(err)
        return res.send(err);
      req.flash('success', { msg: 'Success! Post Added.' });
      res.redirect('/groupdash');        
      // res.json(userlog);
    });
  
  };

  /**Delete entry */
exports.postdeleteforumpost= (req, res) => {
  var thisuser = req.user;
  var forumpostid = req.params.postID;
  console.log(forumpostid);
  forum.findByIdAndRemove(forumpostid, function (err, forum){
    if(err)
      res.send(err);
    req.flash('success', { msg: 'Post Deleted.' });
    res.redirect('/groupdash');       
  })
};


/**Get Edit a Forum Post Page*/
exports.geteditforumpost = (req, res, next) => {
  var thisuser = req.user;
  var postID = req.params.postID;
  console.log(postID);

  forum.findById(postID, function(err, forum){
    res.render('editforumpost',{
      forum: forum
    });
});

  // userlog.find({email: thisuser.email, groupID: thisuser.groupID}, function(err, userLogs){
  //   res.render('editentry', {
  //     userLogs: userLogs,  
  //     thisuser: thisuser,
  //   });
  // });
};

/**Post edit entry */
exports.posteditforumpost = (req, res) => {
  var thisuser = req.user;
  var postID = req.params.postID;
  // userlog.findOneAndUpdate({ObjectId: data},{logentry :{logDate: req.body.editedLogDateTime, logType: req.body.editedlogtype, 
  //   logDetails: req.body.editedLogDetails, individGoalProgress: req.body.editedLogProgress, picture: req.body.editedLogImage}}, {new: true}, function (err, userlog){
  //   if(err)
  //     res.send(err);
  //   req.flash('success', { msg: 'Entry Updated.' });
  //   res.redirect('/account');        
  // });
  forum.findByIdAndUpdate(postID, {message:req.body.editedforumpost}, {new: true}, function(err, forum){
      if(err)
        res.send(err);
      req.flash('success', {msg: 'Post Updated.'});
      res.redirect('/groupdash')
    }) 
}; //end posteditentry