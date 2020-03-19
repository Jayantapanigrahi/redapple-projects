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
var User  = require('./../models/User');
var Employee = require('../schema/Schema').employeeSchema;
var Nominee = require('../schema/Schema').nomineeSchema;
var Master = require('../schema/Schema').masterSchema;
var LifeCertificate = require('../schema/Schema').lifeCertificateDetailsSchema;
var Companies = require('../schema/Schema').companiesSchema;

/*   Model  Relationship  
*/
User.hasOne(Employee,{foreignKey:"user_id"});
User.hasOne(Nominee,{foreignKey:"user_id"});
User.hasOne(Master,{foreignKey:"user_id"});

/*
*Functions
*/

  Employee.createEmployee =function(reqObj){
        return new Promise((resolve,reject) => {            
            Employee.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
      }

  Employee.employeeCount = function(condObj){
        return  new Promise((resolve,reject) => {
            Employee.count({
                where: condObj
            }).then(responses=> {
               resolve(responses);               
            }).catch(err => {
                reject(err);
            });
        });
   };

Employee.employeeDetails =   function(condObj){
        return  new Promise((resolve,reject) => {
            User.findOne({
                where: condObj,
                attributes:['id','firstname','lastname','email','mobile','designation','department','is_mobile_verified','status'],
                include:[{model:Employee},{model:Nominee},{model:Master}],    
                order:[["id","desc"]]      
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }

Employee.medProfileDetails =   function(condObj){
    console.log(condObj);
        return  new Promise((resolve,reject) => {
            User.findOne({
                where: condObj.userCond,
                attributes:['id','firstname','lastname','email','mobile','designation','department','is_mobile_verified','status'],
                include:[{model:Employee, where: condObj.empCondition},{model:Nominee},{model:Master,where:condObj.medCondObj}],    
                order:[["id","desc"]]      
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }
Employee.findEmployee   =   function(reqObj){
        return  new Promise((resolve,reject) => {
            Employee.findOne({
                where: reqObj          
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }

Employee.companyDetails   =   function(reqObj){
        return  new Promise((resolve,reject) => {
            Companies.findOne({
                where: reqObj          
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }

    Employee.getLifeCertificate   =   function(condObj){
        return  new Promise((resolve,reject) => {
            LifeCertificate.findOne({
                where: condObj          
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }
Employee.updateEmployee   =   function(reqObj,conObj){
        return  new Promise((resolve,reject) => {
            Employee.update(reqObj,{
                where: conObj          
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }



Employee.updateMaster   =   function(reqObj,conObj){
        return  new Promise((resolve,reject) => {
          Master.count({
              where: conObj 
            }).then(responses=> {
                if(responses){
                 Master.update(reqObj,{
                   where: conObj          
                    }).then(master=> {
                        resolve(responses);
                    }).catch(err => {
                        reject(err);
                    });
                }
                else
                {
                    Master.create(reqObj).then(master => {
                       resolve(master);
                    }).catch(err => {reject(err); });            
                }
            }).catch(err => {
                reject(err);
            });
        });
    }

Employee.updateLifeCertificate   =   function(conObj,reqObj){
        return  new Promise((resolve,reject) => {
          LifeCertificate.count({
              where: conObj 
            }).then(responses=> {
                if(responses){
                 LifeCertificate.update(reqObj,{
                   where: conObj          
                    }).then(lifeData=> {
                        resolve(responses);
                    }).catch(err => {
                        reject(err);
                    });
                }
                else
                {
                    LifeCertificate.create(reqObj).then(lifeData => {
                       resolve(lifeData);
                    }).catch(err => {reject(err); });            
                }
            }).catch(err => {
                reject(err);
            });
        });
    }




  
module.exports= Employee;


