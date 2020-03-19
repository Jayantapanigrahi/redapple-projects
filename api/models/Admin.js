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
var Admin = {};
var Hospital = require('../schema/Schema').hospitalSchema;
var UserHospitals = require('../schema/Schema').userHospitalSchema;
var Estimation = require('../schema/Schema').estimationSchema;
var EstimateParticulars = require('../schema/Schema').estimateParticularsSchema;
var Employee = require('../schema/Schema').employeeSchema;
var AdmittedEmployee = require('../schema/Schema').admittedEmployeeSchema;
var Master = require('../schema/Schema').masterSchema;

AdmittedEmployee.hasMany(Estimation,{foreignKey:"admission_number"});
AdmittedEmployee.belongsTo(Employee,{foreignKey:"user_id"});
User.hasOne(UserHospitals,{foreignKey:"user_id"});
User.hasMany(Estimation,{foreignKey:"created_by"});
User.hasMany(EstimateParticulars,{foreignKey:"created_by"});
Estimation.hasMany(EstimateParticulars,{foreignKey:"estimation_id"});
Estimation.belongsTo(Hospital,{foreignKey:"hospital_id"});
Estimation.belongsTo(Employee,{foreignKey:"user_id"});
UserHospitals.belongsTo(Hospital,{foreignKey:"hospital_id"});
Employee.hasOne(Master,{foreignKey:"user_id"});
/*   Model  Relationship  
*/

/*
*Functions
*/
  
  
  Admin.estimationListing = function(condObj){
      return new Promise((resolve,reject) => {
           AdmittedEmployee.findAll({
            where: condObj.admnObj,
            include:[
            {model:Estimation, where: condObj.estCondObj,
            include:[{model:EstimateParticulars},{model:Hospital,attributes:["name","address","description",]}],
            },
            {model:Employee,where: condObj.empCondObj,
              include:[{model:Master}] 
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
Admin.updateEstimations =function(condObj,reqObj){
        return new Promise((resolve,reject) => {            
            Estimation.update(reqObj,{where:condObj}).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }
  
module.exports= Admin;


