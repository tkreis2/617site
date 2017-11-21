const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
// const nodemailer = require('nodemailer');
const passport = require('passport');
var mongoose = require('mongoose'),
user = require('../models/User');

/**
 * GET /login
 * Login/signup page.*/
 
exports.getlogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('login', {
    title: 'Log In or Sign Up for HealthWe'
  });
};


/**
 * POST /login
 * Sign in using email and password.
 */

exports.postLogin = (req, res, next) => {
    req.assert('mememailaddr', 'Email is not valid').isEmail();
    req.assert('mempassword', 'Password cannot be blank').notEmpty();
    req.sanitize('mememailaddr').normalizeEmail({ gmail_remove_dots: false });
  
    const errors = req.validationErrors();
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/login');
    }
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', info);
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Success! You are logged in.' });
        // res.redirect(req.session.returnTo || '/');
        return res.redirect('/about');        
      });
    })(req, res, next);
  };
  
  /**
   * GET /logout
   * Log out.
   */
  exports.logout = (req, res) => {
    req.session.destroy(function(err){
      if(err){
        console.log(err);
      }else{
        console.log(session.email);
        req.end();
        res.redirect('/');
      }
    })

  };

 
  /**
   * POST /signup
   * Create a new local account.
   */
  exports.postSignup = (req, res) => {
    req.assert('emailaddr', 'Email is not valid').isEmail();
    req.assert('password', 'Password must be at least 4 characters long').len(4);
    // req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
    req.sanitize('emailaddr').normalizeEmail({ gmail_remove_dots: false });
  
    const errors = req.validationErrors();
  
    if (errors) {
      req.flash('errors', errors);
      return res.redirect('/login');
    }
  
    // const user = new User({
    //   email: req.body.emailaddr,
    //   fullname: req.body.fullname,
    //   joinstart: req.body.joinstart,
    //   groupID: req.body.groupname,
    //   password: req.body.password,
    // });


    var newUser = new user({fullname: req.body.fullname, email: req.body.emailaddr, joinstart: req.body.joinstart, groupID: req.body.groupname, password: req.body.password});
    
    // newUser.setPassword(req.body.password);

    user.findOne({ email: req.body.emailaddr }, (err, existingUser) => {
      if (err) { return next(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address already exists.' });
        return res.redirect('/login');
      }
      newUser.save(function(err, user){
        // var token;
        if(err)
           res.send(err);
        /*res.json(entry);*/     
        // token = user.generatejwt();
        // sendJSONresponse(res, 200, {"token": token});
        res.redirect('/');
      });
    });

  };
  