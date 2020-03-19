/** Required all module**/
var bcrypt = require('bcrypt');
 var salt = bcrypt.genSaltSync(10);
var constants = require("./../config/constants");
var async  = require('async');
var moment = require('moment');
var uuid = require('uuid');
var request = require('request');
var sequelize = require('./../config/sequalize');
var Sequelize   = require('sequelize');
const uuidv4 = require('uuid/v4');
const Op = sequelize.Sequelize.Op;
var moment      = require('moment');
/** Import Model **/
var User  = require('./../models/User');
var Nominee  = require('./../models/Nominee');
var Employee  = require('./../models/Employee');
var Hospital  = require('./../models/Hospital');
var NotificationControler = require('../controllers/NotificationController');
var Bill  = require('./../models/Bill');

/*Async Function*/


/**
 * Route  function
 * @param req
 * @param res
 */
 /*
*  Async function
* */


exports.getEmployees = function(req,res){
  console.log("sddsdsdsdsdsdsddd");
  console.log(req.body.type);
   var condObj = {}
   condObj.is_delete = '0';
   condObj.user_type_id= {[Op.in]:[6]};
   if(req.body.type)
   {
     condObj.verified_by_admin = req.body.type;
   }
   console.log(condObj)
    User.userListing(condObj).then(function (user) { 
     user.forEach(function(element){
        delete element.dataValues["password"];
        delete element.dataValues["access_token"];
        delete element.dataValues["reset_token"];
        delete element.dataValues["access_id"];
        element
        element.dataValues.employees = element.dataValues.employee
        element.dataValues.nominees = element.dataValues.nominee
      })   
       res.send({"status": constants.SUCCESS_STATUS, "result": user, "message": "employee list fetched"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}



exports.employeeDetails = function(req,res){
    let condition={
      id:res.userData.id,
      user_type_id:constants.USER_TYPE_ID.employe,
      is_delete:'0'
    };
    if(req.body.emp_id)
    {
      condition.id = req.body.emp_id;
    }
    Employee.employeeDetails(condition,{}).then(function (employee) {    
        if(employee){  
        if(employee.employee && employee.nominee){
        employee.employees = employee.employee;
        employee.nominees = employee.nominee;
        employee.employees.employee_image = (!employee.employees.employee_image)?"":constants.PROFILE_IMAGE_PATH+employee.employees.employee_image ;
        employee.employees.employee_sign = (!employee.employees.employee_sign)?"":constants.SIGN_IMAGE_PATH+employee.employees.employee_sign ;
        employee.employees.spouse_image = (!employee.employees.spouse_image)?"":constants.PROFILE_IMAGE_PATH+employee.employees.spouse_image ;
        employee.employees.spouse_sign = (!employee.employees.spouse_sign)?"":constants.SIGN_IMAGE_PATH+employee.employees.spouse_sign ;
        employee.nominees.nominee_image = (!employee.nominees.nominee_image)?"":constants.PROFILE_IMAGE_PATH+employee.nominees.nominee_image ;
        employee.nominees.nominee_sign = (!employee.nominees.nominee_sign)?"":constants.SIGN_IMAGE_PATH+employee.nominees.nominee_sign ;
        }
        res.send({"status": constants.SUCCESS_STATUS, "result": employee, "message": "employee details fetched"});
        }
        else
         res.send({"status": constants.SUCCESS_STATUS, "result": {}, "message": "You are not a employee"});
    }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}


exports.medProfileDetails = function(req,res){
  if(!req.body.code || !req.body.medical_card_number ){
              return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
            } 
  let compObj = {code:req.body.code};
   Employee.companyDetails(compObj).then(function (company) { 
    let empCondition={
      company_id:company.id
    };
    
    let medCondObj = {
      medical_card_number:req.body.medical_card_number
    }

    let userCond = {
      user_type_id:constants.USER_TYPE_ID.employe,
      is_delete:'0',
    }
    Employee.medProfileDetails({userCond,empCondition,medCondObj}).then(function (employee) {    
        if(employee){  
        if(employee.employee && employee.nominee){
        employee.employees = employee.employee;
        employee.nominees = employee.nominee;
        employee.employees.employee_image = (!employee.employees.employee_image)?"":constants.PROFILE_IMAGE_PATH+employee.employees.employee_image ;
        employee.employees.employee_sign = (!employee.employees.employee_sign)?"":constants.SIGN_IMAGE_PATH+employee.employees.employee_sign ;
        employee.employees.spouse_image = (!employee.employees.spouse_image)?"":constants.PROFILE_IMAGE_PATH+employee.employees.spouse_image ;
        employee.employees.spouse_sign = (!employee.employees.spouse_sign)?"":constants.SIGN_IMAGE_PATH+employee.employees.spouse_sign ;
        employee.nominees.nominee_image = (!employee.nominees.nominee_image)?"":constants.PROFILE_IMAGE_PATH+employee.nominees.nominee_image ;
        employee.nominees.nominee_sign = (!employee.nominees.nominee_sign)?"":constants.SIGN_IMAGE_PATH+employee.nominees.nominee_sign ;
        }
        res.send({"status": constants.SUCCESS_STATUS, "result": employee, "message": "Med Profile details fetched"});
        }
        else
         res.send({"status": constants.SUCCESS_STATUS, "result": {}, "message": "You are not a employee"});
    }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });

    }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}


function userUpdate(reqObj){
    var userObj = { 
                    'firstname'                  : reqObj.body.firstname,
                    'lastname'                   : reqObj.body.lastname,
                }
      console.log(userObj);       
    return function (callback) {
        User.updateUser(userObj,reqObj.condObjUser).then((user) => {
            callback (null,reqObj);
        }).catch(err => {
            console.log(err);
            callback (err,null);
       });
    }
  }

function employeUpdate(req,callback){
      var employeeObj = {
                    'spouse_name'                : (!req.body.spouse_name)?'':req.body.spouse_name,
                    'updated_by'                 : req.condObj.user_id,
                    'updated_at'                 : moment().format("YYYY-MM-DD HH:mm:ss")
                    }
                    if(req.body.permanent_address)
                    employeeObj.permanent_address = req.body.permanent_address;
                    if(req.body.date_of_joining && req.body.date_of_joining != 'null')
                    employeeObj.date_of_joining = req.body.date_of_joining;
                    if(req.body.date_of_retierment && req.body.date_of_retierment != 'null')
                    employeeObj.date_of_retierment = req.body.date_of_retierment;
                    if(req.body.present_address)
                    employeeObj.permanent_address = req.body.present_address;
                    if(req.body.permanent_address && req.body.lastname)
                    employeeObj.employee_name = req.body.firstname+' '+req.body.lastname;
                    if(req.body.date_of_birth)
                    employeeObj.date_of_birth = req.body.date_of_birth;
                    if(req.body.gender)
                    employeeObj.gender = req.body.gender;
                    if(req.files.img_executive){
                      employeeObj.employee_image = req.files.img_executive[0].filename
                    }
                    if(req.files.img_spouse){
                      employeeObj.spouse_image = req.files.img_spouse[0].filename
                    }
                    if(req.files.sign_executive){
                      employeeObj.employee_sign = req.files.sign_executive[0].filename
                    }
                    if(req.files.sign_spouse){
                      employeeObj.spouse_sign = req.files.sign_spouse[0].filename
                    }
                    
                    console.log(employeeObj);
                    Employee.updateEmployee(employeeObj,req.condObj).then((nominee) => {
                     callback (null, req);
                    }).catch(err => {
                        callback (err,null);
                   });

                  }


function nomineeUpdate(req,callback){
    var nomineeObj = {
                      'nominee_relationship'       :(!req.body.nominee_relationship)?'':req.body.nominee_relationship,
                      'nominee_name'               :(!req.body.nominee_name)?'':req.body.nominee_name,
                      'nominee_address'            :(!req.body.nominee_address)?'':req.body.nominee_address,
                      'updated_by'                 : req.condObj.user_id,
                      'updated_at'                 : moment().format("YYYY-MM-DD HH:mm:ss")
                    };
                if(req.files.sign_nominee){
                        nomineeObj.nominee_sign =  req.files.sign_nominee[0].filename
                     }
                if(req.files.img_nominee){
                      nomineeObj.nominee_image = req.files.img_nominee[0].filename
                    }
            console.log(nomineeObj);
        Nominee.updateNominee(nomineeObj,req.condObj).then((nominee) => {
            callback (null,nominee,req);
        }).catch(err => {
            callback (err,null);
       });
  }


  function masterUpdate(nominee,req,callback){
    var masterObj = {
                      'bank_account_number'        : (!req.body.bank_account_number)?'':req.body.bank_account_number,
                      'ifsc_code'                  : (!req.body.ifsc_code)?'':req.body.ifsc_code,
                      'bank_name'                  : (!req.body.bank_name)?'':req.body.bank_name,
                      'life_certificate_id'        : (!req.body.life_certificate_id)?'':req.body.life_certificate_id,
                      'updated_at'                 : moment().format("YYYY-MM-DD HH:mm:ss"),
                      'updated_by'                 : req.condObj.user_id,
                      'user_id'                    : req.condObj.user_id,
                    };
            if(req.body.medical_card_number)
                masterObj.medical_card_number = req.body.medical_card_number;
            if(req.body.pan_number)
               masterObj.pan_number = req.body.pan_number;
            if(req.body.adhaar_number)
               masterObj.adhaar_number = req.body.adhaar_number;
            if(req.body.medical_card_amount)
               masterObj.medical_card_amount = req.body.medical_card_amount;
            if(req.body.eis_number)
               masterObj.eis_number = req.body.eis_number;
        Employee.updateMaster(masterObj,req.condObj).then((master) => {
             console.log(master);
            callback (null, nominee);
        }).catch(err => {
            callback (err,null);
       });
  }



exports.updateEmployee = function(req, res) {  
          let userObj = req;
          let emp_id = res.userData.id;
          if(req.body.emp_id){
            emp_id = req.body.emp_id;
          }
          userObj.condObj = {user_id:emp_id}
          userObj.condObjUser = {id:emp_id}
          console.log(userObj)              
            async.waterfall(
                [
                  userUpdate(userObj),
                  employeUpdate,
                  nomineeUpdate,
                  masterUpdate,
                ],
                function (err, result) {
                    if(result){
                        res.send({
                            "status":constants.SUCCESS_STATUS,
                            "result":result,
                            "message":"Your profile updated successfully."
                          });
                    }else{
                        console.log(err);
                       res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
                    }
                }
            );
        }

exports.estimateList = function(req, res) {  
          let condObj = {user_id:res.userData.id}
          if(req.body.type){
            condObj.account_department_approval = req.body.type;
          }
          Hospital.estimationListing(condObj,{}).then(function (estimate) {  
           res.send({"status": constants.SUCCESS_STATUS, "result": estimate, "message": "Estimated list fetched"});
           }).catch(err => {
            console.log(err);
              res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
          });
        }

exports.updateLifeCertificate = function(req, res) {  
          if(!req.body.certificate_number || !req.body.start_date || !req.body.end_date){
              return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
            } 
          let condObj = {user_id:res.userData.id}
          let createObj = req.body;
          createObj.user_id = res.userData.id;
          createObj.certificate_name = (!req.file)?"":req.file.filename
          console.log(createObj);
          console.log(condObj);
          
          Employee.updateLifeCertificate(condObj,createObj).then(function (lifeCerificate) {  
           res.send({"status": constants.SUCCESS_STATUS, "result": lifeCerificate, "message": "Life Certificate updated"});
           }).catch(err => {
            console.log(err);
              res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
          });
        }

exports.getCertificate = function(req, res) {  
          let condObj = {user_id:res.userData.id}
          Employee.getLifeCertificate(condObj).then(function (lifeCerificate) {  
           lifeCerificate.dataValues.certificate_name =  (!lifeCerificate.dataValues.certificate_name)?'':constants.LIFE_CERTIFICATE_PATH+ lifeCerificate.dataValues.certificate_name;
           res.send({"status": constants.SUCCESS_STATUS, "result": lifeCerificate, "message": "Life Certificate details Fetched"});
           }).catch(err => {
            console.log(err);
              res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
          });
        }

exports.billList = function(req, res) {  
          let condObj = {user_id:res.userData.id,hospital_submit:'yes'}
          if(req.body.list_type && req.body.list_type == 'Approved'){
            condObj.company_approve =  {[Op.in]: ['Approved','Partially']}
          }
          else{
             condObj.company_approve =  req.body.list_type;
          }
          Bill.billListing(condObj).then(function (bill) {  
           res.send({"status": constants.SUCCESS_STATUS, "result": bill, "message": "Bill list fetched"});
           }).catch(err => {
            console.log(err);
              res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
          });
        }

exports.updateEmployeeCommon = function(req,res){
   if(!req.body.id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var condObj = {id:req.body.id}
   var upData = req.body
   console.log(condObj);
   console.log(upData);
   User.updateUser(upData,condObj).then((user) => {
       res.send({"status": constants.SUCCESS_STATUS, "result": user, "message": "User Updated"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}










