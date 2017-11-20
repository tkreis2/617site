/*const nodemailer = require('nodemailer');
const formentries = require('../models/formentries');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});*/

var mongoose = require('mongoose'),
formentry = require('../models/formentries');

/**
 * GET /contact
 * Contact form page.*/
 
exports.getContact = (req, res) => {
  res.render('contact', {
    title: 'Contact HealthWe'
  });
};


/** POST /contact
 * Send a contact form via Nodemailer.*/

exports.postContact = (req, res) => {
  req.assert('fullname', 'Name cannot be blank').notEmpty();
  req.assert('emailaddr', 'Email is not valid').isEmail();
  req.assert('details', 'Message cannot be blank').notEmpty();

  
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  var newEntry = new formentry({fullname: req.body.fullname, email: req.body.emailaddr, reasoncontact: req.body.reason, message: req.body.details});
  newEntry.save(function(err, entry){
    if(err)
      res.send(err);
    /*res.json(entry);*/
    res.redirect('/');
  });

 /* module.exports.formentryCreate = function(req, res) {
    formentry.create({
      name: req.body.fullname,
      email: req.body.emailaddr,
      reasoncontact: req.body.reason,
      message: req.body.details
    }, function(err, formentry) {
      if (err) {
        sendJsonResponse(res, 400, err);
      } else {
        sendJsonResponse(res, 201, formentries);
      }
    });
  };*/

  /*const mailOptions = {
    to: 'tkreis1@students.towson.edu',
    from: `${req.body.fullname} <${req.body.emailaddr}>`,
    subject: 'Contact Form | HealthWe',
    text: req.body.details
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Message has been sent successfully!' });
    res.redirect('/');

  });*/
};