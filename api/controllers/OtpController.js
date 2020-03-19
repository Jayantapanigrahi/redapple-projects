/** Required all module**/
var bcrypt = require('bcrypt');
var constants = require("./../config/constants");
var async  = require('async');
var moment = require('moment');
/** Import Model **/
var Otp  = require('./../models/Otp');
var User  = require('./../models/User');
var uuid = require('uuid');
var request = require('request');
var sequelize = require('./../config/sequalize');
const Op = sequelize.Sequelize.Op;
var NotificationControler = require('../controllers/NotificationController');
/*Async Function*/


/**
 * Route  function
 * @param req
 * @param res
 */
 /*
*  Async function
* */
function otpCreate(req){
    return function (callback) {
     Otp.createOtpToken({communication_details:req.communication_details,communication_mode:req.communication_mode}).then(function(otpresult) {
        req.otp = otpresult.otp
        callback (null,req);
    }).catch(err => {
            callback (err,null);
    });   
    }
}

function otpSend(req){
  // request('http://api.greenweb.com.bd/api.php?token=9ffaefbbe66895a48ff55fc4a3a4df17&to='+req.communication_details+'&message=Your OTP for TweetUp is'+req.otp , function (error, response, body) {
  // if (!error && response.statusCode == 200) {
  //   console.log(body) 
  // }
  // else {
  //   console.log("Error "+response.statusCode)
  // }
  // })

  var emailData = { email_message:'Dear User,<br>Your OTP for Coal India is: '+req.otp,
                    email_subject:'OTP for COAL INDIA',
                    send_to_user_email:req.communication_details}
  NotificationControler.sendEmailNotification(emailData);
  
}

function updateUser(req,callback){
    req.reset_token = uuid();
     User.updateUser({reset_token: req.reset_token},{id : req.user_id}).then(function(result) {
         callback (null, req);
     }).catch(err => {
         callback (err,null);
     });
 }



exports.generateOtp =function (req,res) {
    if(!req.body.communication_details || !req.body.communiaction_mode ){
        return res.send({"status":"0","result": {},"message":"Parameter Missing!"});
    }
    
   if(!req.body.communication_mail){
      userObj= {[Op.or]:{mobile:req.body.communication_details},is_delete:'0'};
    }else{
       userObj = { [Op.or]: {mobile:req.body.communication_details,email :req.body.communication_mail},is_delete:'0'}
    }
    
    if(!req.body.communication_details.includes("+91"))
            {
                req.body.communication_details = "+91"+req.body.communication_details;
            }

    User.findUser(userObj).then(function (userdetails) {
        if(!userdetails){
    var otpObj={communication_details:req.body.communication_details,communication_mode:req.body.communiaction_mode};
    async.waterfall(
        [
            otpCreate(otpObj),
        ],
    function (err, result) {
      console.log(result);
        if (result) {
            otpSend(result);
            res.send({"status": constants.SUCCESS_STATUS, "result": result, "message": "Otp Send to your phone and E-mail"});
        }else{
            res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something wrong!!"});
        }
    }
    );
   }
   else
   {
      res.send({"status": constants.ERROR_STATUS, "result": {}, "message": "User already registered !!"});
   }
  });
};



exports.generateLoginOtp =function (req,res) {
    if(!req.body.communication_details || !req.body.communiaction_mode){
        return res.send({"status":"0","result": {},"message":"Parameter Missing!"});
    }
    userObj= {email:req.body.communication_details,is_delete:'0'};
    
    User.findUser(userObj).then(function (userdetails) {
      console.log(userdetails);
        if(userdetails){
    var otpObj={communication_details:userdetails.email,communication_mobile:userdetails.mobile,communication_mode:req.body.communiaction_mode};
    async.waterfall(
        [
            otpCreate(otpObj),
        ],
    function (err, result) {
      console.log(result);
        if (result) {
            otpSend(result);
            res.send({"status": constants.SUCCESS_STATUS, "result": result, "message": "Otp Send to your phone no."});
        }else{
            res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something wrong!!"});
        }
    }
    );
   }
   else
   {
      res.send({"status": constants.ERROR_STATUS, "result": {}, "message": "Your are not registered with us!!"});
   }
  });
};


exports.sendResetOtp =function (req,res) {
    if(!req.body.communication_details || !req.body.communiaction_mode || !req.body.communication_code){
        return res.send({"status":"0","result": {},"message":"Parameter Missing!"});
    }     
   if(!req.body.communication_code.includes("+"))
            {
                req.body.communication_code = "+"+req.body.communication_code;
            }
    if(req.body.communiaction_mode =="phone_no"){
       var  userObj= {mobile:req.body.communication_details}
    }else{
       var userObj = { email :req.body.communication_details}
    }
    //console.log(otpObj);
    User.findUser(userObj).then(function (userdetails) {
        if(userdetails){
         var otpObj={communication_details:req.body.communication_code+req.body.communication_details,communication_mode : req.body.communiaction_mode,user_id :userdetails.id};
         //console.log(otpObj);
            async.waterfall(
                [
                    otpCreate(otpObj),
                    updateUser
                ],
            function (err, result) {
                if (result) {
                  console.log(result);
                   otpSend(result);
                   // otpObj.reset_token = req.body.communication_details;
                   delete result.user_id;
                   delete result.otp;
                    res.send({"status": constants.SUCCESS_STATUS, "result": result, "message": "Otp Send to your phone no."});
                }else{
                    res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something wrong!!"});
                }
            });
        }else{
            res.send({"status": constants.ERROR_STATUS, "result": {}, "message": "User not registered !!"});
        } 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Invalid"});
    });     
};


exports.checkOtp=function(req,res){
    if(!req.body.communication_details || !req.body.otp || !req.body.communication_code){
        return res.send({"status":"0","result": {},"message":"Parameter Missing!"});
    }
    if(!req.body.communication_code.includes("+"))
            {
                req.body.communication_code = "+"+req.body.communication_code;
            }

    var otpObj={communication_details:req.body.communication_code+req.body.communication_details,otp:req.body.otp};
    Otp.checkValidOtp(otpObj).then(function (otpDetails) {
        if(otpDetails){

            var to_time     = moment(otpDetails.created_at);
            var from_time  = moment();
            var difference  = Math.abs(to_time.diff(from_time, 'seconds'));
            if(difference<=300){
                res.send({"status": constants.SUCCESS_STATUS, "result": {communication_details:req.body.communication_details}, "message": "Valid Otp"});
            }else{
                res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Expired Otp"});
            }                       
        }else{
            res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Invalid Otp"});
        }        
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Invalid Otp"});
    });   
};












