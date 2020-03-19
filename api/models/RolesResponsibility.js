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

var RolesResponsibility = require('../schema/Schema').userSchema;
var Employee = require('../schema/Schema').employeeSchema;
var Nominee = require('../schema/Schema').nomineeSchema;


/*   Model  Relationship  
*/
RolesResponsibility.hasMany(Employee,{foreignKey:"user_id"});
RolesResponsibility.hasMany(Nominee,{foreignKey:"user_id"});
/*
*Functions
*/

RolesResponsibility.userCount = function(condObj){
        return  new Promise((resolve,reject) => {
            RolesResponsibility.count({
                where:condObj
            }).then(responses=> {
               resolve(responses);               
            }).catch(err => {
                reject(err);
            });
        });
   };
  

  RolesResponsibility.RolesListing = function(reqObj){
      return new Promise((resolve,reject) => {
          RolesResponsibility.findAll({
            where: reqObj,
            include:[{model:Employee}],
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

  RolesResponsibility.editRoles = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            RolesResponsibility.update(reqObj, {where: { id: reqObj.id } }).then(responses=> {   
            Employee.update(reqObj, {where: { user_id: reqObj.id } })    
              resolve(responses);             
            }).catch(err => {
              console.log(err);
                reject(err);
            });
        });
    }

  RolesResponsibility.addRoles =function(reqObj){
       if(reqObj.password)
       reqObj.password = bcrypt.hashSync(reqObj.password, salt);
        return new Promise((resolve,reject) => {            
            RolesResponsibility.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }

  RolesResponsibility.detailsRoles = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            RolesResponsibility.findOne({
                where: reqObj,
                subQuery:false,               
                attributes:["id","code"]
            }).then(responses=> {
              resolve(responses);
            }).catch(err => {
              console.log(err);
                reject(err);
            });
        });
    }

  
module.exports= RolesResponsibility;


