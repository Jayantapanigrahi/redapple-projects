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
var CGHS = require('../schema/Schema').cghsMasterSchema;


/*   Model  Relationship  
*/

/*
*Functions
*/
  

  CGHS.cghsListing = function(reqObj){
      return new Promise((resolve,reject) => {
          CGHS.findAll({
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

  CGHS.editCGHS = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            CGHS.update(reqObj, {where: { id: reqObj.id } }).then(responses=> {    
              resolve(responses);             
            }).catch(err => {
              console.log(err);
                reject(err);
            });
        });
    }

  CGHS.addCGHS =function(reqObj){
        return new Promise((resolve,reject) => {            
            CGHS.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }

  CGHS.detailsCGHS = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            CGHS.findOne({
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

  
module.exports= CGHS;


