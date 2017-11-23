const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
var mongoose = require('mongoose');
var userlog = require('../models/userlog');
var user = require('../models/User');
var mongoresults = [];

/**
 * GET /
 * Individ Dash page.
 */
exports.index = (req, res) => {
  res.render('individdash', {
    title: 'My Dashboard - HealthWe'
  });
};

exports.postlogentry = (req, res) => {
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  var thisuser = req.user;

  var newUserLog = new userlog({email: thisuser.email, groupID: thisuser.groupID, logentry :{logDate: req.body.LogDateTime, logType: req.body.logtype, logDetails: req.body.LogDetails, individGoalProgress: req.body.LogProgress, picture: req.body.LogImage}});

  newUserLog.markModified('logentry');
  newUserLog.save(function(err, userlog){
    if(err)
      res.send(err);
    req.flash('success', { msg: 'Success! Entry Added.' });
    res.redirect('/account');        
    // res.json(userlog);
  });

};
