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
var Sequelize = require("sequelize")
/*
* Include model
*/
var User = require('../schema/Schema').userSchema;

var Hospital = require('../schema/Schema').hospitalSchema;
var UserHospitals = require('../schema/Schema').userHospitalSchema;
var Estimation = require('../schema/Schema').estimationSchema;
var EstimateParticulars = require('../schema/Schema').estimateParticularsSchema;
let Opd = require('../schema/Schema').opdSchema;
let opdConsultation=require('../schema/Schema').consultationSchema;
let opdInjection=require('../schema/Schema').injectionSchema;

let opdMedicine=require('../schema/Schema').medicineSchema;
let opdPathology=require('../schema/Schema').pathologySchema;
//consultationSchema

User.hasOne(UserHospitals,{foreignKey:"user_id"});
User.hasMany(Estimation,{foreignKey:"created_by"});
User.hasMany(EstimateParticulars,{foreignKey:"created_by"});
Estimation.hasMany(EstimateParticulars,{foreignKey:"estimation_id"});
Estimation.belongsTo(Hospital,{foreignKey:"hospital_id"});
UserHospitals.belongsTo(Hospital,{foreignKey:"hospital_id"});
//User.hasMany(Opd,{foreignKey:"created_by"});
//Opd.hasMany(opdConsultation);
//Opd.hasMany(opdInjection);
//Opd.hasMany(opdMedicine);
//Opd.hasMany(opdPathology);
////nw//////////////////////////////////////////
User.hasMany(Opd,{foreignKey:"user_id"});
User.hasMany(Opd,{foreignKey:"created_by"});
User.hasMany(opdConsultation,{foreignKey:"created_by"});
User.hasMany(opdInjection,{foreignKey:"created_by"});
User.hasMany(opdMedicine,{foreignKey:"created_by"});
User.hasMany(opdPathology,{foreignKey:"created_by"});

Opd.hasMany(opdConsultation,{foreignKey:"opd_id"});
Opd.hasMany(opdInjection,{foreignKey:"opd_id"});
Opd.hasMany(opdMedicine,{foreignKey:"opd_id"});
Opd.hasMany(opdPathology,{foreignKey:"opd_id"});
//opdConsultation.hasMany(Opd);

/*   Model  Relationship
*/

/*
*Functions
*/

Hospital.hospitalDetails =   function(condObj){
    return  new Promise((resolve,reject) => {
        User.findOne({
            where: condObj,
            attributes:['id','firstname','lastname','email','mobile','designation','department','is_mobile_verified','status','user_role'],
            include:[{model:UserHospitals,include:[{model:Hospital}] }],
            order:[["id","desc"]]
        }).then(responses=> {
            resolve(responses);
        }).catch(err => {
            reject(err);
        });
    });
}


Hospital.hospitalListing = function(reqObj){
    return new Promise((resolve,reject) => {
        Hospital.findAll({
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

Hospital.editHospital = function(reqObj,condObj) {
    return  new Promise((resolve,reject) => {
        Hospital.update(reqObj, {where: { id: reqObj.id } }).then(responses=> {
            resolve(responses);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}

Opd.addOpd =function(req){
    return new Promise((resolve,reject) => {

        let newObj={
            'accomodation_amount'        : req.body.accomodationAmount,
            'accomodation_date_from'     : req.body.accomodationDateFrom,
            'accomodation_date_to'       : req.body.accomodationDateTo,
            'accomodation_rate'          : req.body.accomodationRate,
            'amount_claimed'             : req.body.amountClaimed,
            'grand_total'                : req.body.grandTotal,
            'medicine_amount'            : req.body.medicineAmount,
            'surgery_amount'             : req.body.surgeryAmount,
            'total_consultation_amount'  : req.body.totalConsultationAmount,
            'total_medicine_amount'      : req.body.totalMedicineAmount,
            'total_injection_amount'     : req.body.totalInjectionAmount,
            'total_patho_amount'         : req.body.totalPathoAmount,
            'user_id'                    : req.body.userId,
            'created_by'                 :1,
            'status'                     :1
        }
        Opd.create(newObj).then(responses => {
            //resolve(responses.id);
            let consultArr=[];
            req.body.consultationArr.map(function(entry) {
                let consultObj = {
                    'amount'        : entry.amount,
                    'opd_id'        :responses.id,
                    'created_by'    :1,
                    'status'        :1,
                    'invoice_file'  :entry.file,//reqObj.files.consultation_file[i].filename
                    'consultation_date' :entry.date

                }
                consultArr.push(consultObj);
                /*opdConsultation.create(consultObj).then(responses => {
                    resolve(responses)

                }).catch(err => {reject(err); });*/
            });
            resolve(consultArr,responses.id)
        }).catch(err => {
            reject(err);
        });


    });
}

//createConsultation
Opd.createConsultation =function(reqObj){
    return new Promise((resolve,reject) => {
        opdConsultation.bulkCreate(reqObj).then(responses => {
            resolve(responses);
        }).catch(err => {reject(err); });
    });
}
//createinjection
Opd.createinjection =function(reqObj){
    return new Promise((resolve,reject) => {
        opdInjection.bulkCreate(reqObj).then(responses => {
            resolve(responses);
        }).catch(err => {reject(err); });
    });
}

Opd.createmedicine =function(reqObj){
    return new Promise((resolve,reject) => {
        opdMedicine.bulkCreate(reqObj).then(responses => {
            resolve(responses);
        }).catch(err => {reject(err); });
    });
}
Opd.createpathology =function(reqObj){
    return new Promise((resolve,reject) => {
        opdPathology.bulkCreate(reqObj).then(responses => {
            resolve(responses);
        }).catch(err => {reject(err); });
    });
}
Opd.addOpdClaim =function(reqObj){
    return new Promise((resolve,reject) => {
        Opd.create(reqObj).then(responses => {
            resolve(responses);
        }).catch(err => {reject(err); });
    });
}

Hospital.addEstimationParticulars =function(reqObj){
    return new Promise((resolve,reject) => {
        EstimateParticulars.bulkCreate(reqObj).then(responses => {
            resolve(responses);
        }).catch(err => {reject(err); });
    });
}


Hospital.estimationListing = function(condObj){
    return new Promise((resolve,reject) => {
        Estimation.findAll({
            where: condObj,
            include:[{model:EstimateParticulars},{model:Hospital,attributes:["name","address","description",]}],
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

Hospital.createUserHospital =function(reqObj){
    return new Promise((resolve,reject) => {
        UserHospitals.create(reqObj).then(responses => {
            resolve(responses);
        }).catch(err => {reject(err); });
    });
}
//getOpdDetails

Opd.getOpdDetails12 =   function(condObj){
    return  new Promise((resolve,reject) => {
        User.findOne({
            where: condObj.user_id,
            attributes:['id','firstname','lastname','email','mobile','designation','department','is_mobile_verified','status','user_role'],
            include:[{model:Opd,include:[{model:opdConsultation,opdInjection}] }],
            order:[["id","desc"]]
        }).then(responses=> {
            resolve(responses);
        }).catch(err => {
            reject(err);
        });
    });
}

Opd.getOpdDetails = function(reqObj){
    return new Promise((resolve,reject) => {
        Opd.findAll({
            where: reqObj,
            include:[{model:opdConsultation},{model:opdInjection},{model:opdMedicine}],
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
Opd.deleteOpd =function(condObj,reqObj){
    return new Promise((resolve,reject) => {
        Opd.destroy({where:condObj}).then(responses => {
            opdConsultation.destroy({where:{opd_id:condObj.id}}).then(consultResponse => {
                opdInjection.destroy({where:{opd_id:condObj.id}}).then(injectionResponse => {
                    opdMedicine.destroy({where:{opd_id:condObj.id}}).then(medicineResponse => {
                        opdPathology.destroy({where:{opd_id:condObj.id}}).then(pathologyResponse => {
                            resolve(pathologyResponse);
                        }).catch(err => {reject(pathologyErr); });
                    }).catch(err => {reject(medicineErr); });
                }).catch(err => {reject(injectionErr); });
                //resolve(response);
            }).catch(err => {reject(consultationErr); });
        }).catch(err => {reject(err); });
    });
}
module.exports= Opd,opdConsultation;


