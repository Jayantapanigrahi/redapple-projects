/**
 * Import Package
 **/
 var bcrypt = require('bcrypt');
 var async = require('async');
 var salt = bcrypt.genSaltSync(10);
 var constants = require("../config/constants");
 var _jade = require('jade');
 var validator = require("email-validator");
 const phone  = require('phone');
 
 /**
  * Import model
  **/
 var MasterData  = require('../models/MasterData');
 

 /**
  * Route function
  **/


exports.companyList=function(req,res){
    MasterData.companyList().then(function (hospital) {
        res.send({"status": constants.SUCCESS_STATUS, "result": hospital, "message": "Company List"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });   
};








