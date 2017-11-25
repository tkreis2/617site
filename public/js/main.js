const passport = require('passport');
var mongoose = require('mongoose');
var user = require('../models/User');$

(document).ready(function() {
  var joinstart = $('#signupform input: [name = joinstart]');
  var groupname = $('#signupform input: [name= groupname]');

  joinstart.change(function (){
    if($('#signupform input: [name = joinstart]') === 'StartGroup'){
        user.find({ groupname: groupname }, (err, existingUser) => {
          if (err) { return next(err); }
          if (existingUser) {
            req.flash('errors', { msg: 'A group with that name already exists. You must either join the group or start a new one.' });
            return res.redirect('/login');
          }
          else{
            
          }
        });
    };
  });
});
