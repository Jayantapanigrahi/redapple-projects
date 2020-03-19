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
 var ProvisionalDiagnosis  = require('../models/ProvisionalDiagnosis');
 

 /**
  * Route function
  **/

function PDList(reqObj){
    return function (callback) {
        ProvisionalDiagnosis.PDListing(reqObj).then((PD) => {
            callback (null,PD);
        }).catch(err => {
            callback (err,null);
       });
    }
  }
 
exports.allPDsList=function(req,res){
    var search_key = (!req.body.search_key)?"":req.body.search_key;
    var limit = (!req.body.limit)?constants.LIMIT:parseInt(req.body.limit);
    var offset = (!req.body.offset)?constants.OFFSET:parseInt(req.body.offset)*2;
    async.waterfall(
          [
            PDList({})
          ],
      function (err, result) {
            if(result){              
                 res.send({"status": constants.SUCCESS_STATUS, "result": {'PDs': result}, "message": "listing"}); 
            }else{
              console.log(err)
                res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
            }
    });
};

exports.editPD=function(req,res){
    ProvisionalDiagnosis.editPD(req.body,{}).then(function (PD) {
        res.send({"status": constants.SUCCESS_STATUS, "result": PD, "message": "PD details updated successfully"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });   
};

exports.addPD=function(req,res){
    ProvisionalDiagnosis.addPD(req.body,{}).then(function (PD) {
        res.send({"status": constants.SUCCESS_STATUS, "result": PD, "message": "New PD added successfully"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });   
};

exports.detailsPD = function(req,res){
    let condition={
      id:req.body.PD_id
    };
    ProvisionalDiagnosis.detailsPD(condition,{}).then(function (PD) {      
        res.send({"status": constants.SUCCESS_STATUS, "result": PD, "message": "PD details fetched"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}








