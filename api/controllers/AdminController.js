/** Required all module**/
var bcrypt = require('bcrypt');
 var salt = bcrypt.genSaltSync(10);
var constants = require("./../config/constants");
var async  = require('async');
var moment = require('moment');
var uuid = require('uuid');
var uniqid = require('uniqid');
 var generator = require('generate-password');
var request = require('request');
var sequelize = require('./../config/sequalize');
var Sequelize   = require('sequelize');
const uuidv4 = require('uuid/v4');
const Op = sequelize.Sequelize.Op;
/** Import Model **/
var User  = require('./../models/User');
var Bill  = require('./../models/Bill');
var NotificationControler = require('../controllers/NotificationController');
var HospitalComuniation  = require('./../models/HospitalComunication');

 
 /**
  * Import model
  **/
 var Admin  = require('../models/Admin');
 

 /**
  * Route function
  **/



exports.getEstimations = function(req, res) {  
    let estCondObj = {};
    let empCondObj = {};
    if(req.body.company_id){
      empCondObj.company_id = req.body.company_id;
    }
    var admnCondObj = {status:'Admitted'}
    if(res.userData.user_type_id == '2')
    {
      if(req.body.list_type && req.body.list_type == 'approved'){
           estCondObj.medical_department_approval = {[Op.in]: ['Approved','Partially']};
        }
       else
       {
         estCondObj.medical_department_approval = 'Pending';
       }
     }
    if(res.userData.user_type_id == '3' || res.userData.user_type_id == '1')
    {
      if(req.body.list_type && req.body.list_type == 'approved'){
           estCondObj.account_department_approval = {[Op.in]: ['Approved','Partially']};
        }
       else
       {
         estCondObj.account_department_approval = 'Pending';
       }
      }
     console.log({estCondObj,admnCondObj,empCondObj});
  Admin.estimationListing({estCondObj,admnCondObj,empCondObj}).then(function (admitedEmp) {  
  admitedEmp.map(function(aelement,key) {  
    aelement.dataValues.totaol_claimed_amount = 0;
    aelement.estimations.map(function(element,key) {
      aelement.dataValues.hospital_name = element.hospital.name;
      aelement.dataValues.employee_name = aelement.employee.employee_name
      aelement.dataValues.totaol_claimed_amount = aelement.dataValues.totaol_claimed_amount+element.total_estimated_amount;
      element.estimate_files = (!element.estimate_files)?"":constants.ESTIMATIONS_FILE_PATH+element.estimate_files ;
    });
   });
   res.send({"status": constants.SUCCESS_STATUS, "result": admitedEmp, "message": "Estimated list fetched"});
   }).catch(err => {
    console.log(err);
      res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
  });
}
exports.updateEstimations = function(req, res) {
 let condObj = {id:req.body.id}
 let reqObj = {id:req.body.id,medical_department_approval:req.body.medical_department_approval,account_department_approval:req.body.account_department_approval}  
 if(req.body.approved_amount){
   reqObj.approved_amount = req.body.approved_amount
 }
 console.log(condObj);
 console.log(reqObj);
  Admin.updateEstimations(condObj,reqObj).then(function (estimate) {  
   res.send({"status": constants.SUCCESS_STATUS, "result": estimate, "message": "Estimated list updated"});
   }).catch(err => {
    console.log(err);
      res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
  });
}


exports.dashboardListing = function(req, res) {
 let FormData=req.body;
    var query="";
    var where="";
    if (FormData.user_type && FormData.user_type == '2') {
      query= query +"(SELECT count(*) from overall_billing where medical_department_approval = 'Pending') as pending_billing_count,(SELECT count(*) from overall_billing where medical_department_approval = 'Approved' OR medical_department_approval = 'Partially') as approved_billing_count,(SELECT count(*) from overall_billing where medical_department_approval = 'Rejected') as rejected_billing_count,"
    }
    if (FormData.user_type && (FormData.user_type == '3' || FormData.user_type == '1')) {
      query= query + "(SELECT count(*) from overall_billing where company_approve = 'Pending') as pending_billing_count,(SELECT count(*) from overall_billing where company_approve = 'Approved' OR company_approve = 'Partially') as approved_billing_count,(SELECT count(*) from overall_billing where company_approve = 'Rejected') as rejected_billing_count,"
    }
     query= query + "(select count(*) from estimation where medical_department_approval = 'Pending') as pending_estimations,(select count(*) from estimation where medical_department_approval = 'Approved' OR medical_department_approval = 'Partially') as approved_estimations,"
     query= query + "(select count(*) from emp_opd_claim ) as opd_claim,(SELECT count(*)  from employee) as emplloyee_count,"
     query= query + "(select count(*) from hospitals ) as hospital_count,(select count(*) from grievance ) as grievance_count"
   

    // if (where=="") {
    //     where=""grievance
    // }
    // else{
    //     where=(where==''?"":where+' AND ')+"doctors.is_deleted='0'"
    //     where="where "+where;
    // }

    // query=query+where;
    query="SELECT" + query +where
    console.log(query);

    sequelize.query(query,{ type: sequelize.QueryTypes.SELECT }).then(response => {
            res.send({"status": constants.SUCCESS_STATUS, "result": response, "message": "Admin dashboard listing"});
      }).catch(err => {
          console.log(err);
          res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
      }); 
}


exports.getComunication = function(req,res){
  
   HospitalComuniation.HCListing({}).then(function (bills) { 
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Comunication List"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
      });
}

exports.editComunication = function(req,res){
   
   HospitalComuniation.editHC(req.body).then(function (bills) { 
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Comunication List"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
      });
}






