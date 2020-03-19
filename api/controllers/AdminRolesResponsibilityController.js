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
 var uniqid = require('uniqid');
 var generator = require('generate-password');
 var NotificationControler = require('../controllers/NotificationController');
 var sequelize = require('../config/sequalize');
 const Op = sequelize.Sequelize.Op;

 /**
  * Import model
  **/
 var RolesResponsibility  = require('../models/RolesResponsibility');
 var User  = require('./../models/User');
 var Employee  = require('./../models/Employee');

 /**
  * Route function
  **/

   
  function userCreate(reqObj){
    var userObj = { 'mobile'                     : reqObj.mobile,
                    'user_type_id'               : reqObj.user_type_id,
                    'email'                      : reqObj.email,
                    'firstname'                  : reqObj.firstname,
                    'lastname'                   : reqObj.lastname,
                    'password'                   : reqObj.password,
                    'department'                 : reqObj.department,                     
                    'is_mobile_verified'         : '0',
                    'status'                     : '1',
                    'designation'                :reqObj.designation,
                    'user_role'                  :reqObj.designation,
                    'access_id'                  :reqObj.access_id,
                }
    return function (callback) {
        RolesResponsibility.addRoles(userObj,{}).then((user) => {
            callback (null,reqObj,user);
        }).catch(err => {
            console.log(err);
            callback (err,null);
       });
    }
  }

function employeCreate(req,user,callback){
      var employeeObj = {
                    'user_id'                    :user.id,
                    'company_id'                 :req.company_id,
                    'employee_id'                :req.employee_id,
                    'employee_name'              :req.firstname+' '+req.lastname,
                    }
        Employee.createEmployee(employeeObj,{}).then((employee) => {
           callback (null, req,user);
        }).catch(err => {
            console.log(err);
            callback (err,null);
       });
  }


function RolesResponsibilityList(reqObj){
    return function (callback) {
        RolesResponsibility.RolesListing(reqObj).then((roles) => {
            callback (null,roles);
        }).catch(err => {
            console.log(err);
            callback (err,null);
       });
    }
  }
 
exports.allRolesResponsibilityList=function(req,res){
    var search_key = (!req.body.search_key)?"":req.body.search_key;
    var limit = (!req.body.limit)?constants.LIMIT:parseInt(req.body.limit);
    var offset = (!req.body.offset)?constants.OFFSET:parseInt(req.body.offset)*2;
    var condObj = {is_delete:'0',user_type_id:{[Op.in]:[2,3,4]}}
    async.waterfall(
          [
            RolesResponsibilityList(condObj)
          ],
      function (err, result) {
            if(result){   
                 result.forEach(function(element) { 
                        element.dataValues.employee_id = element.employee.employee_id;
                        element.dataValues.company_id = element.employee.company_id;
                 });         
                 res.send({"status": constants.SUCCESS_STATUS, "result": {'rolesResponsibility': result}, "message": "listing"}); 
            }else{
                console.log(err);
                res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
            }
    });
};

exports.editRolesResponsibility=function(req,res){
    updateData = req.body;
    updateData.user_type_id = constants.USER_TYPE_ID[req.body.department];
    RolesResponsibility.editRoles(updateData,{}).then(function (roles) {
        res.send({"status": constants.SUCCESS_STATUS, "result": roles, "message": "RolesResponsibility details updated successfully"}); 
    }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });   
};

exports.addRolesResponsibility=function(req,res){
  if(!req.body.employee_id||!req.body.mobile ||!req.body.company_id||!req.body.email ||!req.body.firstname ||!req.body.department){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    }
  let condObj = { [Op.or]: { mobile: req.body.mobile, email:req.body.email }, is_delete:'0'};
  console.log(condObj);
  RolesResponsibility.userCount(condObj).then(function (count) {
  if(count){
    return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"User already exists!"});
  }
  var addData = req.body;
   //addData.password = generator.generate({length: 10,numbers: true});
   addData.password = 'cil#123';
   addData.access_id = uniqid();
   addData.user_type_id = constants.USER_TYPE_ID[req.body.department];
   console.log(addData);
   var emailData = {email_message:'Dear '+addData.firstname+',<br>Your Login details are given bellow<br>User Id:'+addData.access_id+'<br>Password:'+addData.password,
                         email_subject:'Department login details',
                         send_to_user_email:addData.email}
    async.waterfall(
                [
                  userCreate(addData),
                  employeCreate,
                ],
                function (err, result) {
                    if(result){
                      NotificationControler.sendEmailNotification(emailData);
                        res.send({
                            "status":constants.SUCCESS_STATUS,
                            "result":result,
                            "message":"User registered successfully."
                          });
                    }else{
                        console.log(err);
                       res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
                    }
                 });
       });
};

exports.detailsRolesResponsibility = function(req,res){
    let condition={
      id:req.body.cghs_id
    };
    RolesResponsibility.detailsRoles(condition,{}).then(function (roles) {      
        res.send({"status": constants.SUCCESS_STATUS, "result": roles, "message": "RolesResponsibility details fetched"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}








