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
var Nominee = require('../schema/Schema').nomineeSchema;


/*   Model  Relationship  
*/

/*
*Functions
*/

  Nominee.createNominee =function(reqObj){
        return new Promise((resolve,reject) => {            
            Nominee.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }


   Nominee.findNominee   =   function(reqObj){
        return  new Promise((resolve,reject) => {
            Nominee.findOne({
                where: reqObj          
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }
  Nominee.updateNominee   =   function(reqObj,conObj){
        return  new Promise((resolve,reject) => {
            Nominee.update(reqObj,{
                where: conObj          
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }
    

  
module.exports= Nominee;


