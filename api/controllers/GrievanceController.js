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
 var Grievance  = require('../models/Grievance');
 

 /**
  * Route function
  **/

exports.addGrievance=function(req,res){
  if(!req.body.remarks_by_user || !req.body.submitted_by_user && !req.body.created_by && !req.body.gender && !req.body.email && !req.body.phone_no){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
    grvData = {user_id:(!req.body.user_id)?null:req.body.user_id,
               submitted_by_user:(!req.body.submitted_by_user)?'no':req.body.submitted_by_user,
               created_by:req.body.created_by,
               gender:req.body.gender,
               email:req.body.email,
               phone_no:req.body.phone_no,
               file_name:(!req.body.file_name)?'':req.body.file_name,
               state:(!req.body.state)?'':req.body.state,
               district:(!req.body.district)?'':req.body.district,
               address:(!req.body.address)?'':req.body.address,
               pin_code:(!req.body.pin_code)?'':req.body.pin_code
               };
    grvComData = {grievance_id:'',
                  remarks_by_user:req.body.remarks_by_user,
                  remarks_by_company:(!req.body.remarks_by_company)?'':req.body.remarks_by_company,
                }
    Grievance.addGrievance(grvData,grvComData).then(function (result) {
        res.send({"status": constants.SUCCESS_STATUS, "result": result, "message": "Thank you we will get back to you shortly"}); 
    }).catch(err => {
        console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong, Please try again"});
    });   
};


exports.getGrievance=function(req,res){
    Grievance.getGrievance(req.body).then(function (result) {
        res.send({"status": constants.SUCCESS_STATUS, "result": result, "message": "Grievance list"}); 
    }).catch(err => {
        console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong, Please try again"});
    });   
};








