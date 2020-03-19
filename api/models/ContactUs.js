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
var ContactUs = require('../schema/Schema').contactUsSchema;


/*   Model  Relationship  
*/

/*
*Functions
*/
  

  ContactUs.contactUsListing = function(reqObj){
      return new Promise((resolve,reject) => {
          ContactUs.findAll({
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
  ContactUs.addContactUs =function(reqObj){
        return new Promise((resolve,reject) => {            
            ContactUs.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }

  
module.exports= ContactUs;


