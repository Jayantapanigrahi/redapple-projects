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
var ProvisionalDiagnosis = require('../schema/Schema').provisionalDiagnosisSchema;


/*   Model  Relationship  
*/

/*
*Functions
*/
  

  ProvisionalDiagnosis.PDListing = function(reqObj){
      return new Promise((resolve,reject) => {
          ProvisionalDiagnosis.findAll({
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

  ProvisionalDiagnosis.editPD = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            ProvisionalDiagnosis.update(reqObj, {where: { id: reqObj.id } }).then(responses=> {    
              resolve(responses);             
            }).catch(err => {
              console.log(err);
                reject(err);
            });
        });
    }

  ProvisionalDiagnosis.addPD =function(reqObj){
        return new Promise((resolve,reject) => {            
            ProvisionalDiagnosis.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }

  ProvisionalDiagnosis.detailsPD = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            ProvisionalDiagnosis.findOne({
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

  
module.exports= ProvisionalDiagnosis;


