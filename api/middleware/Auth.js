/* Import module*/
var constants = require("../config/constants");
/* Import model*/
var User  = require('../models/User');

/** function check Authentication  Token */
var auth={}
//console.log("Enter Auth");
auth.authChecker = function(req, res, next) {
    if(!req.header("access_token")){
       return res.send({"status":constants.PARAMMISSING_STATUS,"error":{},"message":"Access token is missing !"});
    }
    User.checkCredential({access_token:req.header("access_token")}).then(function (token) {
        //console.log("token",token.status);return false;
        if( token.status == 1 ){            
                res.userData ={
                        id                    : token.id,
                        firstname             : token.firstname,
                        lastname              : token.lastname,
                        email                 : token.email,
                        mobile                : token.mobile,
                        user_role             : token.user_role,
                        user_type_id          : token.user_type_id,
                        access_token          : req.header("access_token")
                };
                next();
                
        }else if(token.status ==0){
            return res.send({"status":constants.LOGIN_ANOTHER_DEVICE,"error":{},"message":"You have login another device!!"});
        }else{
            return res.send({"status":constants.INVALID_TOKEN,"error":{},"message":"Invalid access token !!"});
        }

    }).catch(err => {
       return res.send({"status":constants.INVALID_TOKEN,"error":err,"message":"Invalid access token !!"});
    });
}
module.exports =auth;