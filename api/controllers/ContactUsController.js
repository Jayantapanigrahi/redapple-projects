/**
 * Import Package
 **/
 var async = require('async');
 var constants = require("../config/constants");
 var _jade = require('jade');
 var validator = require("email-validator");
 const phone  = require('phone');
 
 /**
  * Import model
  **/
 var ContactUs  = require('../models/ContactUs');
 

 /**
  * Route function
  **/

exports.addContactUs=function(req,res){
    ContactUs.addContactUs(req.body,{}).then(function (hospital) {
        res.send({"status": constants.SUCCESS_STATUS, "result": hospital, "message": "Thank you we will get back to you shortly"}); 
    }).catch(err => {
        console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong, Please try again"});
    });   
};








