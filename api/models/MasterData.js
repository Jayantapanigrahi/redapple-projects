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
var MasterData = {};
var Companies = require('../schema/Schema').companiesSchema;


/*   Model  Relationship  
*/

/*
*Functions
*/
  

  MasterData.companyList = function(reqObj){
      return new Promise((resolve,reject) => {
          Companies.findAll({
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

  

  
module.exports= MasterData;


