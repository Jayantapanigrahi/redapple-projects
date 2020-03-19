/**
 * Import Package
 **/
 var bcrypt = require('bcrypt');
 var async = require('async');
 var salt = bcrypt.genSaltSync(10);
 var constants = require("../config/constants");
 var _jade = require('jade');
 var validator = require("email-validator");
 const phone  = require('phone');
 var sequelize = require('../config/sequalize');
 const Op = sequelize.Sequelize.Op;
 
 /**
  * Import model
  **/
 var User  = require('../models/User');
 

 /**
  * Route function
  **/


function checkUser(reqObj){
  let condObj = {[Op.or]:{ email: reqObj.email, access_id:reqObj.email }};
    return function (callback) {
        User.findUser(condObj).then(function (user) {
          if (bcrypt.compareSync(reqObj.password, user.password)) {     
             callback (null,user);
          }else{
             callback (err,null);
          }   
        }).catch(err => {
          console.log(err);
            callback (err,null);
       });
    }
}

// function checkUser(reqObj){
//     return function (callback) {
//         User.employeeDetails({email:reqObj.email}).then(function (user) { 
//           if (bcrypt.compareSync(reqObj.password, user.password)) {     
//              callback (null, reqObj,user);
//           }else{
//              callback (err,null);
//           }   
//         }).catch(err => {
//           console.log(err);
//             callback (err,null);
//        });
//     }
// }

function deviceTokenCreate(userObj,callback){  
    User.updateAccessToken({id:userObj.id}).then((device) => {
        userObj.dataValues.access_token  = device.access_token;
        callback (null, userObj);
    }).catch(err => {
        callback (err,null);
    });
}

 exports.adminLogin = function(req, res) {
  console.log(req.body);
    if(!req.body.email||!req.body.password){
        return res.send({"status":constants.PARAMMISSING_STATUS,"result": {},"message":"Parameter Missing!"});
    }
    var loginObj ={email:req.body.email,password:req.body.password};
    async.waterfall(
          [
              checkUser(loginObj),
              deviceTokenCreate
          ],
      function (err, result) {
          if(result){
            if(result.user_type_id == '6' || result.user_type_id == '7')
            {
              res.send({"status":constants.ERROR_STATUS,"result":{err:'not an Admin'},"message":"You are not an Admin"});
            }
            else
            {
              console.log("result",result);//return false;
             delete result.dataValues["password"];            
              res.send({
                  "status" : constants.SUCCESS_STATUS,
                  "result" : result,
                  "message": "Login Successfully"
                });
            }
          }
          else{
            console.log(err);
                res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Invalid Credential"});
          }
      }
   );
};


function userList(reqObj){
    return function (callback) {
        User.userListing(reqObj).then((user) => {
            callback (null,user);
        }).catch(err => {
            callback (err,null);
       });
    }
  }
 
exports.allUsersList=function(req,res){
    var search_key = (!req.body.search_key)?"":req.body.search_key;
    var limit = (!req.body.limit)?constants.LIMIT:parseInt(req.body.limit);
    var offset = (!req.body.offset)?constants.OFFSET:parseInt(req.body.offset)*2;
    async.waterfall(
          [
            userList({search_key:"%"+search_key+"%"})
          ],
      function (err, result) {
            if(result){              
                 res.send({"status": constants.SUCCESS_STATUS, "result": {'users': result}, "message": "listing"}); 
            }else{
                res.send({"status":constants.ERROR_STATUS,"result":err,"message":"Something wrong"});
            }
    });
};

exports.editUser=function(req,res){
    User.editUser(req.body,{}).then(function (user) {
        res.send({"status": constants.SUCCESS_STATUS, "result": user, "message": "User details updated successfully"}); 
    }).catch(err => {
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });   
};

exports.checkToken=function(req,res){
   if(req.body.token){
    User.checkToken({access_token:req.body.token}).then(function (user) {
      if(user){
        res.send({"status": constants.SUCCESS_STATUS, "result": user, "message": "User details"}); 
      }
      else
      {
        res.send({"status": constants.INVALID_TOKEN, "result": {}, "message": "Looks like you have logged in from another device"});
      }
    }).catch(err => {
      console.log(err);
        res.send({"status": constants.ERROR_STATUS, "result": err, "message": "Something went wrong"});
    });
  }
  else{
    res.send({"status": constants.ERROR_STATUS, "result": {}, "message": "Please login"});
  }

};








