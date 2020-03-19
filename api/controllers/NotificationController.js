"use strict";
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
 var uniqid = require('uniqid');
 var generator = require('generate-password');
 const nodemailer = require("nodemailer");
 var fs = require('fs');
 

//  var smtpConfig = {
//             pool: true,
//             host: 'redappletech.com',
//             port: 465,
//             secure: true,
//             auth: {
//               user: 'dev@redappletech.com',
//               pass: 'AAFCR0621L'       
//             },
//             tls: {
//               rejectUnauthorized: false
//             }
// };

var smtpConfig = {
            pool: true,
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'testerredapple2014',
              pass: 'Redapple@2014'       
            },
            tls: {
              rejectUnauthorized: false
            }
};
var transporter = nodemailer.createTransport(smtpConfig);
 transporter.verify(function(error, success) {
   if (error) {
     console.log(error);
   } else {
     console.log("Server is ready to take our messages");
   }
 });


 /**
  * Import model
  **/
 var notification = {};
 



 /**
  * Route function
  **/
notification.sendEmailNotification=function(data){
    var template = process.cwd() + '/views/email/email_notification.jade';
    let subject = data.email_subject;
    fs.readFile(template, 'utf8', function (err, file) {
        if (err) {
            console.log('ERROR!');
        } else {
            var content = data.email_message.replace("[BASEURL]",constants.BASEURL);
            content = file.replace("[CONTENT]",content);
            content = content.replace("[BASEURL]", constants.BASEURL);
                var mailOptions = {
                to: data.send_to_user_email,
                from:'support@coalindia.app',
                subject: subject,
                html: content
            };
            console.log(mailOptions)
                transporter.sendMail(mailOptions, function (error, info) {
                    if(error){
                      console.log(error)
                      console.log('ERROR!');
                      return res.send('ERROR');
                    }
                    res.send("Email sent!");
               });
           }
         });                

}





module.exports =notification





