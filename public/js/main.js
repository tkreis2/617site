// import { error } from "util";

// const passport = require('passport');
// var mongoose = require('mongoose');
// var user = require('../models/User');

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
        // _href= $(this).attr("href");
        // $(this).attr("href", _href +logID );
    });

    $('.deleteentry').click(function(){
        var logID;
        var href;
        logID = $(this).data("id");
        console.log(logID);
        _href= $(this).attr("href");
        $(this).attr("href", _href +logID );
    });



    //Individdash image gallery
    $('.individgallery li:lt(3)').show();
    $('#less').hide()
    var items =  4;
    var minshow = 3;
    var shown =  3;
    var nowshowing = 0;
    $('#more').click(function () {
        shown = $('.individgallery li:visible').length +3;
        nowshowing = shown;
        if(shown < items) {
            $('.individgallery li:lt('+shown+')').show();
            $('#more').show();
            // $('#less').removeClass('hidden');
            $('#less').show();
            return false;
        }
        else {
            $('.individgallery li:lt('+items+')').show();
            // $('#less').removeClass('hidden');
            $('#less').show();
            $('#more').hide();  
            return false; 

        }
    });
    $('#less').click(function () {
        $('.individgallery li').not(':lt(3)').hide();
        nowshowing = shown -3;
        $('#more').show();        
        if((nowshowing < items) || (nowshowing == 0)){
            $('#less').hide();
        }
        return false;         
    });

    //Groupdash image gallery
    $('.groupgallery li:lt(3)').show();
    $('#groupless').hide();
    var items =  10;
    var minshow = 3;
    var shown =  3;
    var nowshowing = 0;
    $('#groupmore').click(function () {
        shown = $('.groupgallery li:visible').length +3;
        nowshowing = shown;
        if(shown < items) {
            $('.groupgallery li:lt('+shown+')').show();
            $('#groupmore').show();
            // $('#less').removeClass('hidden');
            $('#groupless').show();
            return false;
        }
        else {
            $('.groupgallery li:lt('+items+')').show();
            // $('#less').removeClass('hidden');
            $('#groupless').show();
            $('#groupmore').hide();  
            return false; 

        }
    });
    $('#groupless').click(function () {
        $('.groupgallery li').not(':lt(4)').hide();
        nowshowing = shown -4;
        $('#groupmore').show();        
        if((nowshowing < items) || (nowshowing == 0)){
            $('#groupless').hide();
        }
        return false;         
    });


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

    // $(function(){
    //     $('#chartContainer').CanvasJSChart({
    //         title:{
    //             text: "Group Progress"             
    //         },
    //         data: [
    //         {
    //             type: "column",   
    //             dataPoints: [
    //                 {"label": $('#user0').text(), "y": 18 },
    //                 {"label": $('#user1').text(), "y": 18 },
    //                 {"label": $('#user2').text(), "y": 18 },
    //             ]
    //         }
    //         ]
    //         });
    // });
  




  
});
