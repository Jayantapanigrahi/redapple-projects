
/** Required all module**/
var bcrypt = require('bcrypt');
 var salt = bcrypt.genSaltSync(10);
var constants = require("./../config/constants");
var async  = require('async');
var moment = require('moment');
var uuid = require('uuid');
var request = require('request');
var sequelize = require('./../config/sequalize');
var generator = require('generate-password');
var Sequelize   = require('sequelize');
const uuidv4 = require('uuid/v4');
const Op = sequelize.Sequelize.Op;
/** Import Model **/
var User  = require('./../models/User');
var Nominee  = require('./../models/Nominee');
var Employee  = require('./../models/Employee');
var Hospital  = require('./../models/Hospital');
var NotificationControler = require('../controllers/NotificationController');

/*Async Function*/


/**
 * Route  function
 * @param req
 * @param res
 */
 /*
*  Async function
* */
function userCreate(reqObj){
    var userObj = { 'mobile'                     : reqObj.body.mobile,
                    'user_type_id'               : reqObj.user_type_id,
                    'email'                      : reqObj.body.email,
                    'firstname'                  : reqObj.body.firstname,
                    'lastname'                   : reqObj.body.lastname,
                    'user_role'                  : (!reqObj.user_role)?null:reqObj.user_role,
                    'password'                   : bcrypt.hashSync(reqObj.body.password, salt),                                      
                    'is_mobile_verified'         : '1',
                    'status'                     : '1',
                    'designation'                :(!reqObj.body.designation)?'':reqObj.body.designation,
                    'department'                 :(!reqObj.body.department)?'':reqObj.body.department,
                    'access_token'               :uuidv4()
                }
    return function (callback) {
        User.createUser(userObj,{}).then((user) => {
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
                    'employee_image'            : (!req.files)?"":((req.files.img_executive)?req.files.img_executive[0].filename:""),
                    'spouse_image'               : (!req.files)?"":((req.files.img_spouse)?req.files.img_spouse[0].filename:""),
                    'employee_sign'              : (!req.files)?"":((req.files.sign_executive)?req.files.sign_executive[0].filename:""),
                    'spouse_sign'                : (!req.files)?"":((req.files.sign_spouse)?req.files.sign_spouse[0].filename:""),
                    'spouse_name'                : (!req.body.spouse_name)?'':req.body.spouse_name,
                    'permanent_address'          :req.body.permanent_address,
                    'present_address'            :req.body.present_address,
                    'company_id'                 :req.body.company_id,
                    'employee_id'                :req.body.employee_id,
                    'employee_name'              :req.body.firstname+' '+req.body.lastname,
                    'date_of_birth'              :req.body.date_of_birth,
                    'gender'                     :req.body.gender
                    }
         if(req.body.date_of_joining != 'null'){
           employeeObj.date_of_joining = req.body.date_of_joining;
         }
        if(req.body.date_of_retierment != 'null'){
           employeeObj.date_of_retierment = req.body.date_of_retierment;
         }

         console.log(employeeObj);
        Employee.createEmployee(employeeObj,{}).then((employee) => {
           callback (null, req,user);
        }).catch(err => {
            console.log(err);
            callback (err,null);
       });
  }


function hospitalCreate(req,user,callback){
    var hospitalObj = {
                      'created_by'             :user.id,
                      'name'                   :req.body.name,
                      'address'                :req.body.address, 
                      'hospital_url'           :req.body.hospital_url, 
                      'description'            :(!req.body.description)?'':req.body.description,
                      'bank_account_number'    :(!req.body.bank_account_number)?'':req.body.bank_account_number,
                      'ifsc_code'              :(!req.body.ifsc_code)?'':req.body.ifsc_code,
                      'bank_name'              :(!req.body.bank_name)?'':req.body.bank_name,
                      'bank_proof_document'    :(!req.files)?"":((req.files.bank_proof_document)?req.files.bank_proof_document[0].filename:""),
                      'request_message'        :req.body.request_message,
                      'logo'                   : (!req.files)?"":((req.files.logo)?req.files.logo[0].filename:""),
                    }
        Hospital.addHospital(hospitalObj,{}).then((hospital) => {
            callback (null,user,hospital);
        }).catch(err => {
            callback (err,null);
       });
  }


function userHospitalCreate(user,hospital,callback){
    var userHospitalObj = {
                      'user_id'      :user.id,
                      'hospital_id'  :hospital.id
                    }
        Hospital.createUserHospital(userHospitalObj,{}).then((nominee) => {
            callback (null, user);
        }).catch(err => {
            callback (err,null);
       });
  }


function nomineeCreate(req,user,callback){
    var nomineeObj = {
                      'user_id'                    :user.id,
                      'nominee_sign'  : (!req.files)?"":((req.files.sign_nominee)?req.files.sign_nominee[0].filename:""),
                      'nominee_image'  :(!req.files)?"":((req.files.img_nominee)?req.files.img_nominee[0].filename:""),
                      'nominee_relationship'       :(!req.body.nominee_relationship)?'':req.body.nominee_relationship,
                      'nominee_name'               :(!req.body.nominee_name)?'':req.body.nominee_name,
                      'nominee_address'            :(!req.body.nominee_address)?'':req.body.nominee_address,
                    }
        Nominee.createNominee(nomineeObj,{}).then((nominee) => {
            callback (null, req,user);
        }).catch(err => {
            callback (err,null);
       });
  }


function masterCreate(req,user,callback){
    var masterObj = {
                      'medical_card_number'       :(!req.body.medical_card_number)?'':req.body.medical_card_number,
                      'eis_number'                :(!req.body.eis_number)?'':req.body.eis_number,
                      'bank_account_number'       :(!req.body.bank_account_number)?'':req.body.bank_account_number,
                      'ifsc_code'                 : (!req.body.ifsc_code)?'':req.body.ifsc_code,
                      'bank_name'                 : (!req.body.bank_name)?'':req.body.bank_name,
                      'pan_number'                 : (!req.body.pan_number)?'':req.body.pan_number,
                      'adhaar_number'              : (!req.body.adhaar_number)?'':req.body.adhaar_number,
                      'life_certificate_id'        : (!req.body.life_certificate_id)?'':req.body.life_certificate_id,
                      'medical_card_amount'        : (!req.body.medical_card_amount)?'1250000':req.body.medical_card_amount,
                      'user_id'                    : user.id,
                    };
            console.log(masterObj);
        Employee.updateMaster(masterObj,{user_id:user.id}).then((master) => {
            callback (null, user);
        }).catch(err => {
            callback (err,null);
       });
  }


function checkUser(reqObj){
    return function (callback) {
        User.employeeDetails({email:reqObj.email}).then(function (user) { 
          if (bcrypt.compareSync(reqObj.password, user.password)) {     
             callback (null, reqObj,user);
          }else{
             callback (err,null);
          }   
        }).catch(err => {
          console.log(err);
            callback (err,null);
       });
    }
}


function deviceTokenCreate(reqObj,userObj,callback){
    let CondObj = {id:userObj.id};
    User.updateAccessToken(CondObj).then((device) => {
        userObj.dataValues.access_token  = device.access_token;
        callback (null, userObj);
    }).catch(err => {
        callback (err,null);
    });
}


  
exports.userRegistration = function(req, res) {  
  console.log(req.body)
    if(!req.body.password || !req.body.mobile || !req.body.firstname || !req.body.lastname || !req.body.email || !req.body.employee_id || !req.body.company_id || !req.body.permanent_address || !req.body.present_address){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
    let userObj = { [Op.or]: {mobile:req.body.mobile,email :req.body.email},is_delete:'0' }
    let empObj = {employee_id:req.body.employee_id};
    User.userCount(userObj).then(function (userCount) {
        if(userCount){
            res.send({"status":constants.UNIQUIE_EMAIL,"result":{},"message":"User already registered."});
        }else{  
         Employee.employeeCount(empObj).then(function (empCount) {
           if(userCount){
            res.send({"status":constants.UNIQUIE_EMAIL,"result":{},"message":"Employee Id is not available"});
            }else{  
            var userObj = req;
            userObj.user_type_id=constants.USER_TYPE_ID.employe
            console.log(userObj)  
            var emailData = {email_message:'Dear '+userObj.body.firstname+',<br>Your Profile is under review. You can login after Admin approval',
                         email_subject:'Welcome To COAL INDIA Family',
                         send_to_user_email:userObj.body.email}                
            async.waterfall(
                [
                  userCreate(userObj),
                  employeCreate,
                  nomineeCreate,
                  masterCreate
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
                }
            );
        }
    });

    }
    });

};



exports.addEmployeeAdmin = function(req, res) {  
  console.log(req.body)
    if( !req.body.mobile || !req.body.firstname || !req.body.lastname || !req.body.email || !req.body.date_of_joining || !req.body.employee_id || !req.body.company_id || !req.body.permanent_address || !req.body.designation){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
    let userObj = { [Op.or]: {mobile:req.body.mobile,email :req.body.email},is_delete:'0' }
    let empObj = {employee_id:req.body.employee_id};
    User.userCount(userObj).then(function (userCount) {
        if(userCount){
            res.send({"status":constants.UNIQUIE_EMAIL,"result":{},"message":"User already registered."});
        }else{  
          Employee.employeeCount(empObj).then(function (empCount) {
           if(userCount){
            res.send({"status":constants.UNIQUIE_EMAIL,"result":{},"message":"Employee Id is not available"});
            }else{  
            var userObj = req;
            userObj.user_type_id=constants.USER_TYPE_ID.employe
            userObj.body.password = generator.generate({length: 10,numbers: true});
            console.log(userObj)   
            var emailData = {email_message:'Dear '+userObj.body.firstname+',<br>Your Login details are given bellow<br>Email Id:'+userObj.body.email+'<br>Password:'+userObj.body.password,
                         email_subject:'Employee login details',
                         send_to_user_email:userObj.body.email}           
            async.waterfall(
                [
                  userCreate(userObj),
                  employeCreate,
                  nomineeCreate,
                  masterCreate,
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
                }
            );
        }
       });
      }
    });

};


exports.hospitalRegistration = function(req, res) {  
    if(!req.body.password || !req.body.mobile || !req.body.firstname || !req.body.lastname || !req.body.email || !req.body.name || !req.body.address || !req.body.request_message){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
    let userObj = { [Op.or]: {mobile:req.body.mobile,email :req.body.email},is_delete:'0' }
    User.userCount(userObj).then(function (userCount) {
        if(userCount){
            res.send({"status":constants.UNIQUIE_EMAIL,"result":{},"message":"User already registered."});
        }else{  
          var userObj = req;
           userObj.user_type_id=constants.USER_TYPE_ID.empanelled_hospital;
           userObj.body.department='empanelled_hospital';
           userObj.body.designation='admin';
           userObj.user_role='admin';
            console.log(userObj)              
            async.waterfall(
                [
                  userCreate(userObj),
                  hospitalCreate,
                  userHospitalCreate
                ],
                function (err, result) {
                    if(result){
                        res.send({
                            "status":constants.SUCCESS_STATUS,
                            "result":result,
                            "message":"User registered successfully."
                          });
                    }else{
                        console.log(err);
                       res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
                    }
                }
            );
        }
    });

};



exports.userLogin = function(req, res) {
    if(!req.body.email||!req.body.password){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    }
    var loginObj ={email:req.body.email,
                   password:req.body.password,
                   };
    async.waterfall(
          [
            checkUser(loginObj),
            deviceTokenCreate
          ],
      function (err, result) {

          if(result){
             if(result.status == '0')
              {
                res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Your profile has been deactivated!!! Please contact Admin"});
              }
              if(result.verified_by_admin == 'no')
              {
                res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Your profile is not verified!!! Please contact Admin"});
              }
              res.send({
                  "status" :constants.SUCCESS_STATUS,
                  "result" : result,
                  "message": "Login Successfully"
                });
          }else{
                res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Phone number or password is wrong"});
          }
      }
   );
};












