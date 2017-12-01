// import { error } from "util";

// const passport = require('passport');
// var mongoose = require('mongoose');
// var user = require('../models/User');$

$(document).ready(function() {

    //Individ dash userlogs
    $('.editentry').click(function(){
        var logID;
        var href;
        logID = $(this).data("id");
        console.log(logID);
        _href= $(this).attr("href");
        $(this).attr("href", _href +logID );
    });

    function GetURLParameter(sParam){
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++){
            var sParameterName = sURLVariables[i].split('=');
            if(sParameterName[0] == sParam){
                return sParameterName[1];
            }
        }
    }

    $('.posteditentry').click(function(){
        var logID;
        var href;
        logID = $(this).data("id");
        console.log(logID);
        _href= $(this).attr("href");
        $(this).attr("href", _href +logID );
    });

    $('.deleteentry').click(function(){
        var logID;
        var href;
        logID = $(this).data("id");
        console.log(logID);
        _href= $(this).attr("href");
        $(this).attr("href", _href +logID );
    });

    //Image carousel
    // $(document).ready(function(){
    //     $('.img-carousel').slick({
    //         arrows: true
    //     });
    // });

    //Group dash forum posts

    $('.posteditforum').click(function(){
        var forumID;
        var href;
        forumID = $(this).data("id");
        console.log(forumID);
        _href= $(this).attr("href");
        $(this).attr("href", _href +forumID );
    });


    $('.deleteforumpost').click(function(){
        var postID;
        var href;
        postID = $(this).data("id");
        console.log(postID);
        _href= $(this).attr("href");
        $(this).attr("href", _href +postID );
    });


  
});
