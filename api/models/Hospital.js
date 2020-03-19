/*
* Include package 
*/
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var Sequelize = require('sequelize');
var sequelize = require('../config/sequalize');
const Op = sequelize.Sequelize.Op;
var moment = require('moment');
/*
* Include Constants 
*/

var constants = require("../config/constants");
const uuidv4 = require('uuid/v4');

/*
* Include model 
*/
var User = require('../schema/Schema').userSchema;

var Hospital = require('../schema/Schema').hospitalSchema;
var UserHospitals = require('../schema/Schema').userHospitalSchema;
var Estimation = require('../schema/Schema').estimationSchema;
var EstimateParticulars = require('../schema/Schema').estimateParticularsSchema;
var Employee = require('../schema/Schema').employeeSchema;
var AdmittedEmployee = require('../schema/Schema').admittedEmployeeSchema;
var Master = require('../schema/Schema').masterSchema;


AdmittedEmployee.hasMany(Estimation,{foreignKey:"admission_number"});
User.hasOne(UserHospitals,{foreignKey:"user_id"});
User.hasMany(Estimation,{foreignKey:"created_by"});
User.hasMany(EstimateParticulars,{foreignKey:"created_by"});
Estimation.hasMany(EstimateParticulars,{foreignKey:"estimation_id"});
Estimation.belongsTo(Hospital,{foreignKey:"hospital_id"});
AdmittedEmployee.belongsTo(Employee,{foreignKey:"user_id"});
UserHospitals.belongsTo(Hospital,{foreignKey:"hospital_id"});
Hospital.belongsTo(User,{foreignKey:"created_by"});
Employee.hasOne(Master,{foreignKey:"user_id"});

/*   Model  Relationship  
*/

/*
*Functions
*/
  
  Hospital.getAdmissionNo =   function(condObj){
        return  new Promise((resolve,reject) => {
            AdmittedEmployee.findOne({
                where: condObj,
                order:[["id","desc"]]      
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }

Hospital.hospitalDetails =   function(condObj,reqObj){
        return  new Promise((resolve,reject) => {
            User.findOne({
                where: condObj,
                attributes:['id','firstname','lastname','email','mobile','designation','department','is_mobile_verified','status','user_role'],
                include:[{model:UserHospitals,include:[{model:Hospital}] }],    
                order:[["id","desc"]]      
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }


  Hospital.hospitalListing = function(reqObj){
      return new Promise((resolve,reject) => {
          Hospital.findAll({
            where: {is_delete: '0'},
            order:[["id","desc"]]
          }).then(responses=> {
            if(responses)
                resolve(responses);
            else
                reject();
          }).catch(err => {
              reject(err);
          });
      });
  }
Hospital.hospitalListingNew = function(reqObj){
      return new Promise((resolve,reject) => {
          Hospital.findAll({
            where: {is_delete: '0'},
            include:[{model:User}],
            order:[["id","desc"]]
          }).then(responses=> {
            if(responses)
                resolve(responses);
            else
                reject();
          }).catch(err => {
              reject(err);
          });
      });
  }

  Hospital.editHospital = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            Hospital.update(reqObj, {where: { id: reqObj.id } }).then(responses=> {    
              resolve(responses);             
            }).catch(err => {
              console.log(err);
                reject(err);
            });
        });
    }

  Hospital.addHospital =function(reqObj){
        return new Promise((resolve,reject) => {            
            Hospital.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }


  Hospital.addEstimation =function(reqObj){
        return new Promise((resolve,reject) => {            
            Estimation.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }
Hospital.addAdmittedEmployee =function(reqObj){
        return new Promise((resolve,reject) => {            
            AdmittedEmployee.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }

  Hospital.addEstimationParticulars =function(reqObj){
        return new Promise((resolve,reject) => {            
            EstimateParticulars.bulkCreate(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }
  

  Hospital.estimationList = function(condObj,admnObj){
      return new Promise((resolve,reject) => {
          AdmittedEmployee.findAll({
            where: admnObj,
            include:[
            {model:Estimation, where: condObj,
            include:[{model:EstimateParticulars},{model:Hospital,attributes:["name","address","description",]}],
            }
            ,{model:Employee,include:[{model:Master}] 
          }],
            order:[["id","desc"]],
            //group: ['id'],
          }).then(responses=> {
            if(responses)
                resolve(responses);
            else
                reject();
          }).catch(err => {
              reject(err);
          });
      });
  }

  Hospital.updateAdmission = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            AdmittedEmployee.update(reqObj, {where:condObj}).then(responses=> {    
              resolve(responses);             
            }).catch(err => {
              console.log(err);
                reject(err);
            });
        });
    }
Hospital.getAdmitedEmployeeDetails = function(admnObj){
      return new Promise((resolve,reject) => {
          AdmittedEmployee.findOne({
            where: admnObj,
            include:[
            {model:Estimation},{model:Employee,include:[{model:Master}]}
            ],
          }).then(responses=> {
            if(responses)
                resolve(responses);
            else
                reject();
          }).catch(err => {
              reject(err);
          });
      });
  }

  Hospital.createUserHospital =function(reqObj){
        return new Promise((resolve,reject) => {            
            UserHospitals.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }

  
module.exports= Hospital;


