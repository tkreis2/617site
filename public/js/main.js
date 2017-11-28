// import { error } from "util";

// const passport = require('passport');
// var mongoose = require('mongoose');
// var user = require('../models/User');$

$(document).ready(function() {

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





    // var data;
    // $('.editentry').click(function(element){
    //     console.log('edit button clicked');
    //     data = $(this).data("id");
    //     // data = data.toString();
    //     console.log(data);
    //     // data = JSON.stringify(data);        
    //     console.log(data);
    //     $.ajax({
    //         url: 'http://localhost:8080/editlog', 
    //             type: 'POST',
    //             contentType: 'application/json',
    //             processData: false,
    //             data: JSON.stringify(data),
    //             success : function(data){
    //                 data = data;                   

    //         }                
    //     });
    // });
  
});
