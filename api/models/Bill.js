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


var Hospital = require('../schema/Schema').hospitalSchema;
var UserHospitals = require('../schema/Schema').userHospitalSchema;
var Bill = require('../schema/Schema').overallBillingSchema;
var BillDocuments = require('../schema/Schema').billDocumentsSchema;
var Master = require('../schema/Schema').masterSchema;
var AdmittedEmployee = require('../schema/Schema').admittedEmployeeSchema;

Employee.hasOne(Master,{foreignKey:"user_id"});
Bill.belongsTo(Employee,{foreignKey:"user_id"});
User.hasOne(UserHospitals,{foreignKey:"user_id"});
User.hasMany(Bill,{foreignKey:"created_by"});
Bill.hasMany(BillDocuments,{foreignKey:"bill_id"});
Bill.belongsTo(Hospital,{foreignKey:"hospital_id"});
BillDocuments.belongsTo(Hospital,{foreignKey:"hospital_id"});
AdmittedEmployee.hasOne(Bill,{foreignKey:"admission_number"});
AdmittedEmployee.belongsTo(Hospital,{foreignKey:"hospital_id"});


/*   Model  Relationship  
*/

/*
*Functions
*/
  
 Bill.addBill =function(reqObj){
        return new Promise((resolve,reject) => {            
            Bill.create(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }
  Bill.createBillDocuments =function(reqObj){
        return new Promise((resolve,reject) => {            
            BillDocuments.bulkCreate(reqObj).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }
  

  Bill.updateBill =function(condObj,reqObj){
        return new Promise((resolve,reject) => {            
            Bill.update(reqObj,{where:condObj}).then(responses => {
                resolve(responses);
            }).catch(err => {reject(err); });            
        });
  }

  Bill.deleteBill =function(condObj,reqObj){
        return new Promise((resolve,reject) => {            
            Bill.destroy({where:condObj}).then(responses => {
             BillDocuments.destroy({where:{bill_id:condObj.id}}).then(response => {
                resolve(response);
              }).catch(err => {reject(err); });   
            }).catch(err => {reject(err); });            
        });
  }

  Bill.getMedicalHistory =function(condObj){
        return new Promise((resolve,reject) => {            
            AdmittedEmployee.findOne({
              where:condObj,
              include:[{model:Bill},{model:Hospital}],
              order:[["id","desc"]]
            }).then(responses => {
                resolve(responses);
              }).catch(err => {reject(err); });            
        });
  }
  

  Bill.billListing = function(condObj){
      return new Promise((resolve,reject) => {
          Bill.findAll({
            where: condObj,
            include:[{model:BillDocuments},{model:Hospital},
            {model:Employee,include:[{model:Master}]}
            ],
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

module.exports= Bill;


