/** Required all module**/
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var constants = require("./../config/constants");
var async  = require('async');
var moment = require('moment');
var uuid = require('uuid');
var uniqid = require('uniqid');
var generator = require('generate-password');
var request = require('request');
var sequelize = require('./../config/sequalize');
var Sequelize   = require('sequelize');
const uuidv4 = require('uuid/v4');
const Op = sequelize.Sequelize.Op;
let NotificationControler = require('../controllers/NotificationController');
/** Import Model **/
let User  = require('./../models/User');
let Hospital  = require('./../models/Hospital');
let Bill  = require('./../models/Bill');
//let NotificationControler = require('../controllers/NotificationController');
let Opd  = require('./../models/Opd');
const Joi = require('joi');
let Opd1 = require('../schema/Schema').opdSchema;
/**
 * @desc set opd claim
 * @param req
 * @param res
 */
//consultationCreate
function consultationCreate(consultArr,injectionArr1,medicineArr1,pathologyArr1,opd,callback){//consultArr,injectionArr1,medicineArr1,pathologyArr1,opd
    //return function (callback) {
        Opd.createConsultation(consultArr, {}).then((consultation) => {
            callback(null, consultArr,injectionArr1,medicineArr1,pathologyArr1,opd);
        }).catch(err => {
            callback(err, null);
        });
   // }
}
//injectionCreate
function injectionCreate(consultArr,injectionArr1,medicineArr1,pathologyArr1,opd,callback){//consultArr,opdId
    //return function (callback) {
    Opd.createinjection(injectionArr1, {}).then((consultation) => {
        callback(null, consultArr,injectionArr1,medicineArr1,pathologyArr1,opd);
    }).catch(err => {
        callback(err, null);
    });
    // }
}
function medicineCreate(consultArr,injectionArr1,medicineArr1,pathologyArr1,opd,callback){//consultArr,opdId
    //return function (callback) {
    Opd.createmedicine(medicineArr1, {}).then((consultation) => {
        callback(null, consultArr,injectionArr1,medicineArr1,pathologyArr1,opd);
    }).catch(err => {
        callback(err, null);
    });
    // }
}
function pathologyCreate(consultArr,injectionArr1,medicineArr1,pathologyArr1,opd,callback){//consultArr,opdId
    //return function (callback) {
    Opd.createpathology(pathologyArr1, {}).then((consultation) => {
        callback(null, consultArr,injectionArr1,medicineArr1,pathologyArr1,opd);
    }).catch(err => {
        callback(err, null);
    });
    // }
}


function opdCreate(req,res){
    let newObj={
        'accomodation_amount'        : req.body.accomodationAmount,
        
        'accomodation_rate'          : req.body.accomodationRate,
        'amount_claimed'             : req.body.amountClaimed,
        'grand_total'                : req.body.grandTotal,
        'medicine_amount'            : req.body.medicineAmount,
        'surgery_amount'             : req.body.surgeryAmount,
        'total_consultation_amount'  : req.body.totalConsultationAmount,
        'total_medicine_amount'      : req.body.totalMedicineAmount,
        'total_injection_amount'     : req.body.totalInjectionAmount,
        'total_patho_amount'         : req.body.totalPathoAmount,
        'user_id'                    : res.userData.id,
        'created_by'                 :1,
        'status'                     :1
    }
    if(req.body.accomodationDateFrom){newObj.accomodation_date_from = req.body.accomodationDateFrom}
    if(req.body.accomodationDateTo){newObj.accomodation_date_to = req.body.accomodationDateTo}
        

    return function(callback){
        Opd.addOpdClaim(newObj,{}).then((opd) => {
            let consultArr=[];
            let injectionArr1=[];
            let medicineArr1=[];
            let pathologyArr1=[];
            // console.log(req.files.consultation_file[0].fieldname);
            // console.log(req.files.consultation_file[0].filename);
            console.log(typeof (JSON.parse(req.body.consultationArr)));
            let consultArr1=JSON.parse(req.body.consultationArr);
            let injectionArr=JSON.parse(req.body.injectionArr);
            let medicineArr=JSON.parse(req.body.medicineArr);
            let pathologyArr=JSON.parse(req.body.pathoArr);
            console.log(consultArr1.length);
            console.log(injectionArr.length);
            console.log(medicineArr.length);
            consultArr1.map(function(entry,key) {
                console.log(key);

                let consultObj = {
                    'amount'        : entry.consultation_amount,
                    'opd_id'        :opd.id,
                    'created_by'    :1,
                    'status'        :1,
                    'invoice_file'  :(!req.files.consultation_file)?'':req.files.consultation_file[key].filename,//reqObj.files.consultation_file[i].filename
                    'consultation_date' :entry.consultation_date

                }
                consultArr.push(consultObj);

            });
            //injectionArr
            injectionArr.map(function(entry,key) {
                console.log(key);

                let injectionObj = {
                    'amount'        : entry.injection_amount,
                    'opd_id'        :opd.id,
                    'created_by'    :1,
                    'status'        :1,
                    'invoice_file'  :(!req.files.injection_file)?'':req.files.injection_file[key].filename,//reqObj.files.consultation_file[i].filename
                    'inject_date' :entry.injection_date

                }
                injectionArr1.push(injectionObj);
            });

            medicineArr.map(function(entry,key) {
                console.log(key);

                let medicineObj = {
                    'amount'        : entry.medicine_amount,
                    'opd_id'        :opd.id,
                    'created_by'    :1,
                    'status'        :1,
                    'invoice_file'  :(!req.files.medicine_file)?'':req.files.medicine_file[key].filename,//reqObj.files.consultation_file[i].filename
                    'medicine_date' :entry.medicine_date

                }
                medicineArr1.push(medicineObj);
            });
            pathologyArr.map(function(entry,key) {
                console.log(key);

                let pathologyObj = {
                    'amount'        : entry.patho_amount,
                    'opd_id'        :opd.id,
                    'created_by'    :1,
                    'status'        :1,
                    'invoice_file'  :(!req.files.pathology_file)?'':req.files.pathology_file[key].filename,//reqObj.files.consultation_file[i].filename
                    'patho_date' :entry.patho_date

                }
                pathologyArr1.push(pathologyObj);
            });
            callback (null,consultArr,injectionArr1,medicineArr1,pathologyArr1,opd);
        }).catch(err => {
            callback (err,null);
        });
    }
}
exports.setOpd = function(req, res) {

    let schema = Joi.object().keys({
        accomodationAmount:Joi.string(),
        accomodationDateFrom: Joi.optional(),
        accomodationDateTo: Joi.optional(),
        accomodationRate:Joi.optional(),
        amountClaimed:Joi.string().required(),
        grandTotal:Joi.string().required(),
        medicineAmount:Joi.optional(),
        surgeryAmount:Joi.optional(),
        totalConsultationAmount:Joi.string().required(),
        totalMedicineAmount:Joi.string().required(),
        totalInjectionAmount:Joi.string().required(),
        totalPathoAmount:Joi.string().required(),
        //user_id:Joi.number().required(),
        //userId:Joi.number().required(),
        consultationArr:Joi.array().required(),
        injectionArr:Joi.array().required(),
        medicineArr:Joi.array().required(),
        pathoArr:Joi.array().required(),
        //consultationAmount:Joi.string().required(),
        //consultationFile:Joi.string().required(),
        //consultationDate:Joi.string().required()
    });
    const {body} = req;
    let result = Joi.validate(body, schema);
    const {value, error} = result;


    const valid = error == null;
    if (!valid) {
        let data = { status: constants.VALIDATION_ERROR, result: result.error.name, message: result.error.details[0].message.replace(new RegExp('"', "g"), '') };
        return res.status(201).send(data);
    }
    else{
        console.log("ok");
        //opdCreate
        let userObj = {};
        userObj.accomodation_amount=req.body.accomodationAmount;
        userObj.accomodation_date_from=req.body.accomodationDateFrom;
        userObj.accomodation_date_to=req.body.accomodationDateTo;
        userObj.accomodation_rate=req.body.accomodationRate;
        userObj.amount_claimed = req.body.amountClaimed;
        userObj.grand_total=req.body.amountClaimed;
        userObj.medicine_amount=req.body.medicineAmount;
        userObj.surgery_amount=req.body.surgeryAmount;
        userObj.total_consultation_amount=req.body.totalConsultationAmount;
        userObj.total_medicine_amount=req.body.totalConsultationAmount;
        userObj.total_injection_amount=req.body.totalConsultationAmount;
        userObj.total_patho_amount=req.body.totalConsultationAmount;
        //userObj.user_id=req.body.userId;
        userObj.user_id=res.userData.id;

        userObj.consultation_arr=req.body.consultationArr;
        //userObj.consultation_file=req.body.consultationFile;
        //userObj.consultation_date=req.body.consultationDate

        console.log(userObj);
        async.waterfall(
            [
                opdCreate(req,res),
                consultationCreate,
                injectionCreate,
                medicineCreate,
                pathologyCreate
                //userHospitalCreate
            ],
            function (err, result) {
                if(result){
                    res.send({
                        "status":constants.SUCCESS_STATUS,
                        //"result":result,
                        "message":"Opd added successfully."
                    });
                }else{
                    console.log(err);
                    res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
                }
            }
        );

    }
};
















