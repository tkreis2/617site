// const passport = require('passport');
// var mongoose = require('mongoose');
// var user = require('../models/User');$

$(document).ready(function() {
    $('.editentry').click(function(){
        var entryid = $(this).attr('data-id');
        $.ajax({
            method: "POST",
            url: "/editlog",
            data: {"ObjectId": data-id},
            success: function(result){
                if(err){
                    res.send(err)
                }
                res.redirect('account');                
            }
        })
    });

    $('.deleteentry').click(function(){
        var entryid = $(this).attr('data-id');
        $.ajax({
            method: "POST",
            url: "/editlog",
            data: {"ObjectId": data-id},
            success: function(result){
                if(err){
                    res.send(err)
                }
                res.redirect('account');                
            }
        })
    });    
});
