    var otp = require('./../schema/Schema').otpSchema;
    var moment = require('moment');

    otp.removeAttribute('id');
    otp.createOtpToken =function(reqObj){
       return  new Promise((resolve,reject) => {
        otp.destroy({where:reqObj}).then(responses=> {
            //reqObj.otp = Math.floor(Math.random() * 100000);
            reqObj.otp = Math.floor(1000 + Math.random() * 9000);
            //reqObj.otp =1234
            reqObj.created_at   = moment().format("YYYY-MM-DD HH:mm:ss");
            //console.log("reqObj",reqObj)
            
                otp.create(reqObj)
                .then(responses=> {
                     return resolve(responses);
                }).catch(err => {
                     return reject(err);
                });          
            }).catch(err => {
                   reject(err);
            });
        });
    }

    otp.checkValidOtp = function(reqObj){
        return  new Promise((resolve,reject) => {
            otp.findOne({where:reqObj})
            .then(otpdetails=> {
                otp.destroy({where:reqObj}).then(responses=> {
                  resolve(otpdetails);
                }).catch(err => {
                     return reject(err);
                });  
            }).catch(err => {
                 reject(err);
            });
        });
    }

    otp.deleteToken =function(reqObj){
        return  new Promise((resolve,reject) => {
          otp.destroy({where:reqObj}).then(responses=> {
               resolve(responses);           
          }).catch(err => {
               reject(err);
          });
        });
    }

    module.exports =otp;