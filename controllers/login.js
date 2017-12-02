const bluebird = require('bluebird');
const crypto = bluebird.promisifyAll(require('crypto'));
const nodemailer = require('nodemailer');
const passport = require('passport');
var mongoose = require('mongoose');
var user = require('../models/User');
var userlogs = require('../models/userlog');
var isNew = false;

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
        return res.redirect('/account');        
      });
    })(req, res, next);
  };
  
  /**
   * GET /logout
   * Log out.
   */
  exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
  };

 

  /**
 * GET /login
 * Login/signup page.*/
 
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }else{
    isNew = true
    res.render('login', {
      title: 'Sign Up for HealthWe',
      isNew: isNew
  });
  }
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


    var newUser = new user({fullname: req.body.fullname, email: req.body.emailaddr, joinstart: req.body.joinstart, groupID: req.body.groupname, 
      individGoal: req.body.goalvalue, password: req.body.password, completions: 0, individGoalType: req.body.goaltype, individGoalDesc: req.body.goaldesc, totalGoalValue: req.body.goalvalue,
    totalGoalProgress: 0});
    
    // newUser.setPassword(req.body.password);

    user.findOne({groupID: req.body.groupname}, (err, existingGroup) => {
      if(err) {return next(err);}
      if(existingGroup){
        isNew = true;
        if(req.body.joinstart === 'StartGroup'){
          req.flash('errors', {msg: 'Group with that name already exists. You must either join the group or select a different group name.'});
          return res.redirect('/signup');
        }
      }
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
        req.logIn(user, (err) => {
          if (err) { return next(err); }
          req.flash('success', { msg: 'Success! You are logged in.' });
          res.redirect('/account');
        });
      });
    });
  });

  //   user.findOne({ email: req.body.emailaddr }, (err, existingUser) => {
  //     if (err) { return next(err); }
  //     if (existingUser) {
  //       req.flash('errors', { msg: 'Account with that email address already exists.' });
  //       return res.redirect('/login');
  //     }
  //     newUser.save(function(err, user){
  //       // var token;
  //       if(err)
  //          res.send(err);
  //       /*res.json(entry);*/     
  //       // token = user.generatejwt();
  //       // sendJSONresponse(res, 200, {"token": token});
  //       req.logIn(user, (err) => {
  //         if (err) { return next(err); }
  //         req.flash('success', { msg: 'Success! You are logged in.' });
  //         res.redirect('/account');
  //     });
  //   });
  //  });
  };

  /**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  var thisuser = req.user;
  userlogs.remove({email: thisuser.email}, (err) =>{
    if (err) { return next(err); }
  })
  user.remove({ _id: req.user.id }, (err) => {
    if (err) { return next(err); }
    req.logout();
    req.flash('info', { msg: 'Your account has been deleted.' });    
    res.redirect('/');  
  });
};

/**Forgot */
/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('forgot', {
    title: 'Forgot Your Password?'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert('email', 'Please enter a valid email address.').isEmail();
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  const createRandomToken = crypto
    .randomBytesAsync(16)
    .then(buf => buf.toString('hex'));

  const setRandomToken = token =>
    user
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Account with that email address does not exist.' });
        } else {
          user.passwordResetToken = token;
          user.passwordResetExpires = Date.now() + 3600000; // 1 hour
          user = user.save();
        }
        return user;
      });

  const sendForgotPasswordEmail = (user) => {
    if (!user) { return; }
    const token = user.passwordResetToken;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'tkschoolprojects@gmail.com',
        pass: 'towsontigers'
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'memberservices@healthwe.com',
      subject: 'Reset your password on HealthWe',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('info', { msg: `An e-mail has been sent to ${user.email} with further instructions.` });
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect('/forgot'))
    .catch(next);
};

/**Resetting */

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  user
    .findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec((err, user) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('reset', {
        title: 'Password Reset'
      });
    });
};


/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  const resetPassword = () =>
    user
      .findOne({ passwordResetToken: req.params.token })
      .where('passwordResetExpires').gt(Date.now())
      .then((user) => {
        if (!user) {
          req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
          return res.redirect('back');
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(() => new Promise((resolve, reject) => {
          req.logIn(user, (err) => {
            if (err) { return reject(err); }
            resolve(user);
          });
        }));
      });

  const sendResetPasswordEmail = (user) => {
    if (!user) { return; }
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'tkschoolprojects@gmail.com',
        pass: 'towsontigers'
      }
    });
    const mailOptions = {
      to: user.email,
      from: 'memberservices@healthwe.com <tkschoolprojects@gmail.com>',
      subject: 'Your HealthWe password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`
    };
    return transporter.sendMail(mailOptions)
      .then(() => {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => { if (!res.finished) res.redirect('/'); })
    .catch(err => next(err));
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const provider = req.params.provider;
  user.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save((err) => {
      if (err) { return next(err); }
      req.flash('info', { msg: `${provider} account has been unlinked.` });
      res.redirect('/account');
    });
  });
};