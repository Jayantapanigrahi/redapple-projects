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
var Hospital  = require('./../models/Hospital');
var HospitalComuniation  = require('./../models/HospitalComunication');
var Bill  = require('./../models/Bill');
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
    var userObj = { 'mobile'                     : reqObj.mobile,
                    'user_type_id'               : reqObj.user_type_id,
                    'email'                      : reqObj.email,
                    'firstname'                  : reqObj.firstname,
                    'lastname'                   : reqObj.lastname,
                    'created_by'                 : reqObj.created_by,
                    'user_role'                  : reqObj.user_role,
                    'password'                   : bcrypt.hashSync(reqObj.password, salt),                                      
                    'is_mobile_verified'         : '0',
                    'status'                     : '1',
                    'designation'                :(!reqObj.designation)?'':reqObj.designation,
                    'department'                 :(!reqObj.department)?'':reqObj.department,
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
function userUpdate(reqObj){
    var userObj = { 
                    'firstname'                  : reqObj.body.firstname,
                    'lastname'                   : reqObj.body.lastname,
                }
     let condition={
      id:reqObj.user_id,
    };     
    return function (callback) {
        User.updateUser(userObj,condition).then((user) => {
            callback (null,reqObj,user);
        }).catch(err => {
            console.log(err);
            callback (err,null);
       });
    }
  }


function hospitalUpdate(req,user,callback){
    var hospitalObj ={
                      'name'                   :req.body.name,
                      'address'                :req.body.address, 
                      'description'            :(!req.body.description)?'':req.body.description,
                      'bank_account_number'    :(!req.body.bank_account_number)?'':req.body.bank_account_number,
                      'ifsc_code'              :(!req.body.ifsc_code)?'':req.body.ifsc_code,
                      'bank_name'              :(!req.body.bank_name)?'':req.body.bank_name,
                      'id'                     :req.body.hospital_id
                      }


                    if(req.files.bank_proof_document){
                      hospitalObj.bank_proof_document = req.files.bank_proof_document[0].filename
                    }
                    if(req.files.logo){
                      hospitalObj.logo = req.files.logo[0].filename
                    }
        Hospital.editHospital(hospitalObj).then((nominee) => {
            callback (null, user);
        }).catch(err => {
            callback (err,null);
       });
  }
function userHospitalCreate(reqObj,user,callback){
    var userHospitalObj = {
                      'user_id'      :user.id,
                      'hospital_id'  :reqObj.hospital_id
                    }
        Hospital.createUserHospital(userHospitalObj,{}).then((nominee) => {
            callback (null, user);
        }).catch(err => {
            callback (err,null);
       });
  }

  function estimationCreate(reqObj){
    var estimateObj = {
                      'user_id'               :reqObj.body.user_id,
                      'doctor_name'           :reqObj.body.doctor_name,
                      'hospital_id'           :reqObj.body.hospital_id,
                      'date_of_admission'     :reqObj.body.date_of_admission,
                      'provisional_diagnosis' :reqObj.body.provisional_diagnosis,
                      'admission_number'      :reqObj.body.admission_number,
                      'plan_of_treatment'     :reqObj.body.plan_of_treatment,
                      'total_estimated_amount':reqObj.body.total_estimated_amount,
                      'hospital_remarks'      :reqObj.body.hospital_remarks,
                      'hospital_disclaimer'   :reqObj.body.hospital_disclaimer,
                      'created_by'            :reqObj.created_by,
                      'estimate_files'        :(!reqObj.file)?"":reqObj.file.filename
                    }
        reqObj.body.amount_estimation = JSON.parse(reqObj.body.amount_estimation);
        return function(callback){
        Hospital.addEstimation(estimateObj,{}).then((estimation) => {
            callback (null,reqObj,estimation);
        }).catch(err => {
            callback (err,null);
       });
      }
  }

  function estimationParticularsCreate(reqObj,estimation,callback){
    var particularsArr = [];
     reqObj.body.amount_estimation.forEach(function(element){
         let pushData = {
           estimation_id:estimation.id,
           particulars:element.particulars,
           cghs_code:element.cghs_code,
           amount:element.amount,
           created_by:estimation.created_by
         };
        particularsArr.push(pushData);
    });
        Hospital.addEstimationParticulars(particularsArr,{}).then((particulars) => {
            callback (null, reqObj,estimation);
        }).catch(err => {
            console.log(err);
            callback (err,null);
       });
  }

function CreateEmployeeAdmission(reqObj,estimation,callback){
      console.log(reqObj.body)
      if(reqObj.body.is_admited == 'no'){
        let addData = {
                      'user_id'               :reqObj.body.user_id,
                      'hospital_id'           :reqObj.body.hospital_id,
                      'date_of_admission'     :reqObj.body.date_of_admission,
                      'admission_number'      :reqObj.body.admission_number,
                      'created_by'            :reqObj.created_by,
        }
        Hospital.addAdmittedEmployee(addData).then((particulars) => {
            callback (null, estimation);
        }).catch(err => {
             console.log(err);
            callback (err,null);
       });
      }
      else
      {
        callback (null, estimation);
      }
  }



function billCreate(reqObj,res){
    var estimateObj = {
                      'user_id'               :reqObj.body.user_id,
                      'medical_service_description':reqObj.body.medical_service_description,
                      'hospital_id'           :reqObj.body.hospital_id,
                      'final_diagnosis'     :reqObj.body.final_diagnosis,
                      'line_of_treatment'   :reqObj.body.line_of_treatment,
                      'date_of_discharge'     :reqObj.body.date_of_discharge,
                      'admission_number'     :reqObj.body.admission_number,
                      'total_cost':reqObj.body.total_cost,
                      'created_by'            :reqObj.created_by,
                      'discharge_summary_document':(!reqObj.files.discharge_files)?"":reqObj.files.discharge_files['0'].filename,
                    }
        if(res.userData.user_role == 'admin' || res.userData.user_type_id == '5')
        {
          estimateObj.hospital_submit = 'yes';
          estimateObj.hospital_submit_date =  new Date();
          let admsnCond = {admission_number:reqObj.body.admission_number};
          let admsnupdata = {status:'Discharged'};
          Hospital.updateAdmission(admsnupdata,admsnCond).then((admission) => {
               console.log("admission")
               }).catch(err => {
                 console.log(err);
                callback (err,null);
           });
          }
        var documents = JSON.parse(reqObj.body.bill_document);
        console.log(documents);
        return function(callback){
        Bill.addBill(estimateObj,{}).then((bill) => {
             var documentsArr = [];
             for (var i = 0; i < documents.length; i++) {
             let documents_data = {user_id:bill.user_id,
                                   hospital_id:bill.hospital_id,
                                   bill_id:bill.id,
                                   invoice_number:documents[i].invoice_number,
                                   document_description:documents[i].document_description,
                                   amount:documents[i].amount,
                                   document_name:reqObj.files.invoice_images[i].filename,
                                 };
                documentsArr.push(documents_data);
             };
            callback (null,documentsArr,bill);
        }).catch(err => {
            callback (err,null);
       });
      }
  }

  function billDocumentCreate(documentsArr,bill,callback){
        Bill.createBillDocuments(documentsArr,{}).then((documents) => {
            callback (null, bill);
        }).catch(err => {
            callback (err,null);
       });
  }


exports.hospitalDetails = function(req,res){
    let condition={
      id:res.userData.id,
      user_type_id:5,
      is_delete:'0'
    };
    Hospital.hospitalDetails(condition,{}).then(function (hospital) {    
        if(hospital){ 
        
        if(hospital.user_hospital){
        hospital.dataValues.user_hospital = hospital.user_hospital.hospital;
        hospital.dataValues.user_hospital.logo = (!hospital.dataValues.user_hospital.logo)?"":constants.HOSPITAL_IMAGE_PATH+hospital.dataValues.user_hospital.logo;
        hospital.dataValues.user_hospital.bank_proof_document = (! hospital.dataValues.user_hospital.bank_proof_document)?"":constants.HOSPITAL_BANK_IMAGE_PATH+hospital.dataValues.user_hospital.bank_proof_document ;
        }
        res.send({"status": constants.SUCCESS_STATUS, "result": hospital, "message": "Hospital details fetched"});
        }
        else
         res.send({"status": constants.ERROR_STATUS, "result": {}, "message": "Something bad happened with your access, Please write us"});
    }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}
  
exports.createHospitalUser = function(req, res) {  
    if(res.userData.user_role != 'admin' || res.userData.user_type_id != '5'){
      return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
    }
    if(!req.body.hospital_id || !req.body.mobile || !req.body.firstname || !req.body.lastname || !req.body.email ){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
    let userObj = { [Op.or]: {mobile:req.body.mobile,email :req.body.email},is_delete:'0' }
    User.userCount(userObj).then(function (userCount) {
        if(userCount){
            res.send({"status":constants.UNIQUIE_EMAIL,"result":{},"message":"User already registered."});
        }else{  
          var userObj = req.body;
           userObj.user_type_id=constants.USER_TYPE_ID.empanelled_hospital;
           userObj.department='empanelled_hospital';
           userObj.designation='data_entry';
           userObj.user_role='data_entry';
           userObj.created_by = res.userData.id;
           userObj.password = generator.generate({length: 10,numbers: true});
           var emailData = {email_message:'Dear '+userObj.firstname+',<br>Your Login details are given bellow<br>Email:'+userObj.email+'<br>Password:'+userObj.password,
                            email_subject:'Hospital login details',
                            send_to_user_email:userObj.email}
           console.log(userObj)              
            async.waterfall(
                [
                  userCreate(userObj),
                  userHospitalCreate
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

};



exports.updateHospitalProfile = function(req, res) {
    if(res.userData.user_role != 'admin' || res.userData.user_type_id != '5'){
      return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
    }
    if(!req.body.hospital_id || !req.body.firstname || !req.body.lastname || !req.body.name || !req.body.address){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    }        
             estObj = req;
             estObj.user_id = res.userData.id;
             async.waterfall(
                [
                  userUpdate(estObj),
                  hospitalUpdate
                ],
                function (err, result) {
                    if(result){
                        res.send({
                            "status":constants.SUCCESS_STATUS,
                            "result":result,
                            "message":"Profile updated successfully."
                          });
                    }else{
                        console.log(err);
                       res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
                    }
                }
            );

};



exports. addEstimation = function(req, res) { 
    if(res.userData.user_type_id != '5'){
      return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
    }
    if(!req.body.hospital_id || !req.body.user_id || !req.body.date_of_admission || !req.body.doctor_name || !req.body.provisional_diagnosis || !req.body.plan_of_treatment || !req.body.hospital_remarks|| !req.body.hospital_disclaimer|| !req.body.amount_estimation){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    }        
             estObj = req;
             console.log(req.file);
             estObj.created_by = res.userData.id;
             async.waterfall(
                [
                  estimationCreate(estObj),
                  estimationParticularsCreate,
                  CreateEmployeeAdmission
                ],
                function (err, result) {
                    if(result){
                        res.send({
                            "status":constants.SUCCESS_STATUS,
                            "result":result,
                            "message":"Estimation submitted successfully."
                          });
                    }else{
                        console.log(err);
                       res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
                    }
                }
            );

};




exports. addBill = function(req, res) { 
    if(res.userData.user_type_id != '5'){
      return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
    }
    if(!req.body.hospital_id || !req.body.user_id || !req.body.total_cost || !req.body.date_of_discharge || !req.body.medical_service_description || !req.body.final_diagnosis || !req.body.line_of_treatment){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    }        
             estObj = req;
             //console.log(req.files);
             estObj.created_by = res.userData.id;
             async.waterfall(
                [
                  billCreate(estObj,res),
                  billDocumentCreate
                ],
                function (err, result) {
                    if(result){
                        res.send({
                            "status":constants.SUCCESS_STATUS,
                            "result":result,
                            "message":"Bill submitted successfully."
                          });
                    }else{
                        console.log(err);
                       res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
                    }
                }
            );

};

exports.getHospitalUser = function(req,res){
   if(res.userData.user_role != 'admin' || res.userData.user_type_id != '5'){
      return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
    }
    let condition={
      created_by:res.userData.id,
      user_type_id:5,
      is_delete:'0',
      user_role:'data_entry'
    };
    User.userListing(condition,{}).then(function (user) {    
      console.log(user);
      user.forEach(function(element){
        delete element.dataValues["password"];
        delete element.dataValues["access_token"];
        delete element.dataValues["reset_token"];
        delete element.dataValues["access_id"];
      })
       res.send({"status": constants.SUCCESS_STATUS, "result": user, "message": "Hospital details fetched"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}

exports.getAdmissionNo = function(req,res){
   if(!req.body.hospital_id || !req.body.user_id ){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    }        
      
    let condition={
      user_id:req.body.user_id,
      status:'Admitted'
    };
    Hospital.getAdmissionNo(condition,{}).then(function (admitted_employee) {   
       if(admitted_employee){ 
         if(admitted_employee.hospital_id == req.body.hospital_id){
             res.send({"status": constants.SUCCESS_STATUS, "result": admitted_employee, "message": "Admitted employee details fetched"});
            }
          else{
             res.send({"status": constants.UNIQUIE_EMAIL, "result": admitted_employee, "message": "Employee is admitted in other hospital!"});
            }
          }
       else
       {
         res.send({"status": constants.ERROR_STATUS, "result": {}, "message": "Not admitted"});
       }
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}


exports.updateHospitalUser = function(req,res){
   if(res.userData.user_role != 'admin' || res.userData.user_type_id != '5'){
      return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
    }

    let condition={
      id:req.body.id,
    };
    var userObj = { 
                    'firstname'                  : req.body.firstname,
                    'lastname'                   : req.body.lastname,
                }
    User.updateUser(userObj,condition).then(function (user) {    
      console.log(user);
       res.send({"status": constants.SUCCESS_STATUS, "result": userObj, "message": "User details updated"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}


exports.getCILEmployees = function(req,res){
   // if(res.userData.user_role != 'admin' || res.userData.user_type_id != '5'){
   //    return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
   //  }
   var condObj = {verified_by_admin:'yes',is_delete:'0',user_type_id:{[Op.in]:[6]}}
    User.userListing(condObj).then(function (user) { 
     user.forEach(function(element){
        delete element.dataValues["password"];
        delete element.dataValues["access_token"];
        delete element.dataValues["reset_token"];
        delete element.dataValues["access_id"];
        element.dataValues.employee_name = element.employee.employee_name;
                element.dataValues.employee_id = element.employee.employee_id;
        element.dataValues.medical_card_number = element.master.medical_card_number;
        element.dataValues.pan_number = element.master.pan_number;
        element.dataValues.adhaar_number = element.master.adhaar_number;
        element.dataValues.eis_number = element.master.eis_number;
      })   
       res.send({"status": constants.SUCCESS_STATUS, "result": user, "message": "CIL employee list fetched"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}


exports.getBill = function(req,res){
   // if(res.userData.user_role != 'admin' || res.userData.user_type_id != '5'){
   //    return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
   //  }
   if(!req.body.hospital_id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var condObj = {hospital_id:req.body.hospital_id}
    if(req.body.collection && req.body.collection == 'partial'){
        condObj.created_by = res.userData.id;
      }
    if(req.body.list_type && req.body.list_type == 'approved'){
            condObj.company_approve =  {[Op.in]: ['Approved','Partially']};
      }
      else{
        condObj.company_approve =  {[Op.in]: ['Rejected','Pending']};
      }
    if(req.body.start_date &&  req.body.start_date!= "" && req.body.end_date && req.body.end_date!= ""){
       let from_date = moment(req.body.start_date).format("YYYY-MM-DD");
       let to_date = moment(req.body.end_date).add(1,'d').format("YYYY-MM-DD");
        condObj.company_approval_date={[Op.between]: [from_date, to_date]}
      }
      else{
        let to_date = moment().add(1,'d').format('YYYY-MM-DD');
        let from_date = moment().subtract(8,'d').format('YYYY-MM-DD');
        condObj.created_at={[Op.between]: [from_date, to_date]}
      }
    Bill.billListing(condObj).then(function (bills) { 
     bills.forEach(function(element){
        element.bill_documents.forEach(function(doc){
          doc.document_name = constants.BILSS_FILE_PATH+doc.document_name
        });
         element.discharge_summary_document = constants.BILSS_FILE_PATH+element.discharge_summary_document
        })   
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Bill list fetched"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}
exports.estimateList = function(req,res){
   // if(res.userData.user_role != 'admin' || res.userData.user_type_id != '5'){
   //    return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
   //  }
   if(!req.body.hospital_id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var estCondObj = {hospital_id:req.body.hospital_id,account_department_approval:'Pending'}
   var admnCondObj = {hospital_id:req.body.hospital_id,status:'Admitted'}
    if(req.body.collection && req.body.collection == 'partial'){
        estCondObj.created_by = res.userData.id;
      }
    if(req.body.list_type && req.body.list_type == 'approved'){
         estCondObj.account_department_approval = {[Op.in]: ['Approved','Partially']};
      }
    Hospital.estimationList(estCondObj,admnCondObj).then(function (estimate) {  
           res.send({"status": constants.SUCCESS_STATUS, "result": estimate, "message": "Estimated list fetched"});
           }).catch(err => {
            console.log(err);
              res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
          });
        }

exports.getAdmitedEmployeeDetails = function(req,res){
   if(!req.body.hospital_id || !req.body.user_id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var admnCondObj = {hospital_id:req.body.hospital_id,user_id:req.body.user_id,status:'Admitted'}
    Hospital.getAdmitedEmployeeDetails(admnCondObj).then(function (estimate) {  
           res.send({"status": constants.SUCCESS_STATUS, "result": estimate, "message": "Admitted employee details fetched"});
           }).catch(err => {
            console.log(err);
              res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
          });
        }


exports.getBillsByAdmin = function(req,res){
   var condObj = {};
   condObj.hospital_submit = 'yes'
   if(req.body.type && (req.body.admin_type == '3'|| req.body.admin_type == '1'))
   { 
     if(req.body.type == 'approved')
     {
     condObj.company_approve =  {[Op.in]: ['Approved','Partially']};
     }
     else if(req.body.type == 'rejected')
     {
       condObj.company_approve =  'Rejected';
        condObj.medical_department_approval ='Rejected';
     }
     else
     {
       condObj.medical_department_approval = {[Op.in]: ['Approved','Partially']};
       condObj.company_approve =  'Pending';
     }
   }
   if(req.body.type && req.body.admin_type == '2')
   { 
     if(req.body.type == 'approved')
     {
     condObj.medical_department_approval =  {[Op.in]: ['Approved','Partially']};
     }
     else if(req.body.type == 'rejected')
     {
       condObj.medical_department_approval =  'Rejected';
     }
     else
     {
       condObj.medical_department_approval = 'Pending'
     }
   }
    Bill.billListing(condObj).then(function (bills) { 
     bills.forEach(function(element){
        element.bill_documents.forEach(function(doc){
          doc.document_name = constants.BILSS_FILE_PATH+doc.document_name
        });
         element.discharge_summary_document = constants.BILSS_FILE_PATH+element.discharge_summary_document
         element.dataValues.employee = element.employee.employee_name;
         element.dataValues.hospital = element.hospital.name;
      })   
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Bill list fetched"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}

exports.adminUpdateBill = function(req,res){
   if(!req.body.id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var condObj = {id:req.body.id}
   var upData = req.body
   if(req.body.hospital_submit && reqObj.body.admission_number && req.body.hospital_submit == 'yes' ){
     let admsnCond = {admission_number:reqObj.body.admission_number};
          let admsnupdata = {status:'Discharged'};
          Hospital.updateAdmission(admsnupdata,admsnCond);
   }
   console.log(condObj);
   console.log(upData);
   Bill.updateBill(condObj,upData).then(function (bills) { 
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Bill Approved"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}
exports.addComunication = function(req,res){
   if(!req.body.remarks || !req.body.hospital_id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var addData = {remarks:req.body.remarks,
                  hospital_id:req.body.hospital_id,
                  created_by:res.userData.id
                  }
   console.log(addData);
   HospitalComuniation.addComunication(addData).then(function (bills) { 
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Comunicated to Admin"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}
exports.getComunication = function(req,res){
   if(!req.body.hospital_id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var condData = {
                  hospital_id:req.body.hospital_id,
                  }
   HospitalComuniation.HCListing(condData).then(function (bills) { 
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Comunication List"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}

exports.getMedicalHistory = function(req,res){
   if(!req.body.user_id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var condData = {
                  user_id:req.body.user_id,
                  status:'Discharged',
                  }
   Bill.getMedicalHistory(condData).then(function (bills) { 
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Medical History fetched"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}

exports.updateBill = function(req,res){
   if(res.userData.user_role != 'admin' || res.userData.user_type_id != '5'){
      return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
    }
   if(!req.body.bill_id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var condObj = {id:req.body.bill_id}
   var upData = {hospital_submit:req.body.hospital_submit,hospital_submit_date:req.body.hospital_submit_date}
   console.log(condObj);
   console.log(upData);
   Bill.updateBill(condObj,upData).then(function (bills) { 
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Bill Approved"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}

exports.deleteBill = function(req,res){
   if(res.userData.user_role != 'admin' || res.userData.user_type_id != '5'){
      return res.send({"status":constants.ERROR_STATUS,"result": {},"message":"You are not authorised to perform this task!"});
    }
   if(!req.body.bill_id){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    } 
   var condObj = {id:req.body.bill_id}
   Bill.deleteBill(condObj).then(function (bills) { 
       res.send({"status": constants.SUCCESS_STATUS, "result": bills, "message": "Bill Approved"});
       }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
}



  











