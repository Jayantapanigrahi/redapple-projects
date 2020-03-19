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
var Employee = require('../schema/Schema').employeeSchema;
var Nominee = require('../schema/Schema').nomineeSchema;
var Hospital = require('../schema/Schema').hospitalSchema;
var Master = require('../schema/Schema').masterSchema;
var Companies = require('../schema/Schema').companiesSchema;

User.hasOne(Employee,{foreignKey:"user_id"});
Employee.belongsTo(Companies,{foreignKey:"company_id"});
User.hasOne(Nominee,{foreignKey:"user_id"});
User.hasMany(Hospital,{foreignKey:"created_by"});
User.hasOne(Master,{foreignKey:"user_id"});

/*   Model  Relationship  
*/

/*
*Functions
*/
  User.checkCredential =function(reqObj){
        return new Promise((resolve,reject) => {
            User.findOne({
              where:reqObj,              
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


  User.checkToken =function(reqObj){
        return new Promise((resolve,reject) => {
            User.findOne({
              where:reqObj,              
              order:[["id","desc"]]
            }).then(responses=> {
             resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
  }

  User.createUser = function(reqObj,condObj){
        return new Promise((resolve,reject) => {
            User.create(reqObj).then(responses=> {
                if(responses) {                    
                   delete responses.dataValues.password;
                   resolve(responses);  
                }else{
                    reject(err)
                };
            }).catch(err => { reject(err); });
        });
    }


 User.employeeDetails   =   function(reqObj){
        return  new Promise((resolve,reject) => {
            User.findOne({
                subQuery:false,
                where: reqObj,
                include:[{model:Employee},{model:Nominee},{model:Hospital}]              
            }).then(responses=> {
              console.log(responses);
                resolve(responses);
            }).catch(err => {
              console.log(err);
                reject(err);
            });
        });
    }



  User.userCount = function(condObj){
        return  new Promise((resolve,reject) => {
            User.count({
                where: condObj
            }).then(responses=> {
               resolve(responses);               
            }).catch(err => {
                reject(err);
            });
        });
   };

   User.findUser   =   function(reqObj){
        return  new Promise((resolve,reject) => {
            User.findOne({
                where: reqObj,
                 include:[{model:Employee}],         
            }).then(responses=> {
                resolve(responses);
            }).catch(err => {
                reject(err);
            });
        });
    }

    User.updateAccessToken = function(reqObj){
        return new Promise((resolve,reject) => {

            User.update(
                {access_token:uuidv4()},{where: {id:reqObj.id}})
            .then(responses=> {
                if(responses){
                    User.findUser(reqObj).then(user => {
                        resolve(user);      
                    })
                }                
            }).catch(err => {
                reject(err);
            });
        });
    }

    User.updateUser = function(updateData,whereObj) {
        return new Promise((resolve, reject) => {
          User.update(updateData, {where: whereObj}).then(responses => {
              if (responses) {
                  resolve(responses);
              } else {
                  reject();
              };
          }).catch(err => {
              reject(err)
          });
        });
    }

//  __________________________________ For Admin _________________________________

  User.userListing = function(condObj){
      return new Promise((resolve,reject) => {
          User.findAll({
            where: condObj,
            include:[{model:Employee,include:[{model:Companies}]},{model:Nominee},{model:Hospital},{model:Master}],
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

  User.editUser = function(reqObj,condObj) {
        return  new Promise((resolve,reject) => {
            User.update(reqObj, {where: { id: reqObj.id } }).then(responses=> {    
              resolve(responses);             
            }).catch(err => {
              console.log(err);
                reject(err);
            });
        });
    }

  
module.exports= User;


