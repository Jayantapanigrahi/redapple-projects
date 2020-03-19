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
var HospitalComuniation = require('../schema/Schema').HospitalCommunicationsSchema;


/*   Model  Relationship  
*/

/*
*Functions
*/
  

  HospitalComuniation.HCListing = function(reqObj){
      return new Promise((resolve,reject) => {
          HospitalComuniation.findAll({
            where: reqObj,
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

  HospitalComuniation.editHC = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            HospitalComuniation.update(reqObj, {where: { id: reqObj.id } }).then(responses=> {    
              resolve(responses);             
            }).catch(err => {
              console.log(err);
                reject(err);
            });
        });
    }

  HospitalComuniation.addComunication =function(reqObj){
        return new Promise((resolve,reject) => {            
            HospitalComuniation.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }

  HospitalComuniation.detailsHC = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            HospitalComuniation.findOne({
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

  
module.exports= HospitalComuniation;


