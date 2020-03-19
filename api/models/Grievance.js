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
var Grievance = require('../schema/Schema').grievanceSchema;
var GrievanceComunication = require('../schema/Schema').grievanceComunicationSchema;


/*   Model  Relationship  
*/
Grievance.hasMany(GrievanceComunication);
/*
*Functions
*/
  

  Grievance.getGrievance = function(reqObj){
      return new Promise((resolve,reject) => {
          Grievance.findAll({
            include:[{model:GrievanceComunication}],
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
  Grievance.addGrievance =function(grvData,grvComData){
        return new Promise((resolve,reject) => {            
            Grievance.create(grvData).then(grv => {
                grvComData.grievance_id = grv.id;
                GrievanceComunication.create(grvComData).then(responses => {
                  resolve(responses);
                }).catch(err => {reject(err); });    
            }).catch(err => {reject(err); });            
        });
  }

  
module.exports= Grievance;


