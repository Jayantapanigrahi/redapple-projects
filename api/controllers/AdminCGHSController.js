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
 var CGHS  = require('../models/CGHS');
 

 /**
  * Route function
  **/

function cghsList(reqObj){
    return function (callback) {
        CGHS.cghsListing(reqObj).then((cghs) => {
            callback (null,cghs);
        }).catch(err => {
            callback (err,null);
       });
    }
  }
 
exports.allCGHSsList=function(req,res){
    var search_key = (!req.body.search_key)?"":req.body.search_key;
    var limit = (!req.body.limit)?constants.LIMIT:parseInt(req.body.limit);
    var offset = (!req.body.offset)?constants.OFFSET:parseInt(req.body.offset)*2;
    async.waterfall(
          [
            cghsList({search_key:"%"+search_key+"%"})
          ],
      function (err, result) {
            if(result){              
                 res.send({"status": constants.SUCCESS_STATUS, "result": {'cghss': result}, "message": "listing"}); 
            }else{
                res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
            }
    });
};

exports.editCGHS=function(req,res){
    CGHS.editCGHS(req.body,{}).then(function (cghs) {
        res.send({"status": constants.SUCCESS_STATUS, "result": cghs, "message": "CGHS details updated successfully"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });   
};

exports.addCGHS=function(req,res){
    CGHS.addCGHS(req.body,{}).then(function (cghs) {
        res.send({"status": constants.SUCCESS_STATUS, "result": cghs, "message": "New CGHS added successfully"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });   
};

exports.detailsCGHS = function(req,res){
    let condition={
      id:req.body.cghs_id
    };
    CGHS.detailsCGHS(condition,{}).then(function (cghs) {      
        res.send({"status": constants.SUCCESS_STATUS, "result": cghs, "message": "cghs details fetched"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}








