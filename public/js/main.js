// import { error } from "util";

// const passport = require('passport');
// var mongoose = require('mongoose');
// var user = require('../models/User');$

$(document).ready(function() {
    // e.preventDefault();
    var data;
    $('.editentry').click(function(){
        console.log('edit button clicked');
        data = $(this).data("id");
        data = JSON.stringify(data);        
        $("input[name=logentryID").val(data);
        console.log(data);
        // $.ajax({
        //     type: 'POST',
        //     data: JSON.stringify(data.id),
        //     contentType: 'application/json',
        //     url: '/editlog',            
        //     success: function(data){
        //         console.log(JSON.stringify(data));
        //     }
        // });
    });
  
});
