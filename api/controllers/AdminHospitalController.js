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
 var Hospital  = require('../models/Hospital');
 

 /**
  * Route function
  **/

function hospitalList(reqObj){
    return function (callback) {
        Hospital.hospitalListingNew(reqObj).then((hospital) => {
            callback (null,hospital);
        }).catch(err => {
            callback (err,null);
       });
    }
  }
 
exports.allHospitalsList=function(req,res){
    var search_key = (!req.body.search_key)?"":req.body.search_key;
    var limit = (!req.body.limit)?constants.LIMIT:parseInt(req.body.limit);
    var offset = (!req.body.offset)?constants.OFFSET:parseInt(req.body.offset)*2;
    async.waterfall(
          [
            hospitalList({search_key:"%"+search_key+"%"})
          ],
      function (err, result) {
            if(result){    
             //console.log(result);
             result.forEach(function(element){
              //console.log(element.dataValues);
              element.dataValues.logo = (!element.dataValues.logo)?"":constants.HOSPITAL_IMAGE_PATH+element.dataValues.logo;
              element.dataValues.bank_proof_document = (!element.dataValues.bank_proof_document)?"":constants.HOSPITAL_BANK_IMAGE_PATH+element.dataValues.bank_proof_document;       
             })
              res.send({"status": constants.SUCCESS_STATUS, "result": {'hospitals': result}, "message": "listing"}); 
            }else{
                 console.log(err);
                res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
            }
    });
};

exports.editHospital=function(req,res){
    console.log(req.body);
    console.log(req.files);
    Hospital.editHospital(req.body,{}).then(function (hospital) {
        res.send({"status": constants.SUCCESS_STATUS, "result": hospital, "message": "Hospital details updated successfully"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });   
};

exports.addHospital=function(req,res){
    Hospital.addHospital(req.body,{}).then(function (hospital) {
        res.send({"status": constants.SUCCESS_STATUS, "result": hospital, "message": "New hospital added successfully"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });   
};








