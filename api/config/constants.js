/** constants declaration **/
module.exports = {
    /* Status code*/

    ERROR_STATUS: "0",
    SUCCESS_STATUS: "1",
    UNIQUIE_EMAIL: "2",
    PARAMMISSING_STATUS: "0",
    INVALID_TOKEN: "10",
    INVALID_EMAIL: "4",
    INVALID_CONTACT: "5",
    /* Node mailer*/
    
    //TRANSPORTER :transporter,
    /* Link */

    //BASEURL : "http://localhost:5001",
    //FILEURL :"http://localhost:5001/images/",    
    
    BASEURL : "http://94.237.120.42:3002/",
    FILEURL :"http://94.237.120.42:3002/images/",    


    PROFILE_IMAGE_PATH      :"http://localhost:3002/images/user_images/avatar/",
    LIFE_CERTIFICATE_PATH   :"http://localhost:3002/images/user_images/life-certificate/",
    SIGN_IMAGE_PATH         :"http://localhost:3002/images/user_images/signeture/",
    HOSPITAL_IMAGE_PATH     :"http://localhost:3002/images/hospital_images/avatar/",
    HOSPITAL_BANK_IMAGE_PATH:"http://localhost:3002/images/hospital_images/bank/",
    BILSS_FILE_PATH         :"http://localhost:3002/images/bills/",
    ESTIMATIONS_FILE_PATH   :"http://localhost:3002/images/estimations/",

    /*PAGGIGNATION SET UP*/

    LIMIT :20,
    OFFSET:0,
    /*DEFAULT VALUE SET*/
    
    DEFAULT_INTEGER    : 0,
    DEFAULT_STRING     : "",
    DEFAULT_STRING_NO  : "",
    DEFAULT_COINS      : 25000,
    /* NOtification options*/
 
    /* --- For Roulette Defaults ---*/
    
    GAME_WAITING_TIME           : 10, /* Seconds */
    TURN_WAITING_TIME           : 20, /* Seconds */
    MIN_USER_PERTICIPATE_INROOM : 1,
    MAX_USER_PERTICIPATE_INROOM : 5,
    MAX_TURN_SINGLE             : 50,
    MAX_TURN_DOUBLE             : 100,
    //INTERVALTIME                : 30000
    SPAWN_PLACEMENT_INTERVAL    : 10, /* Seconds */
    USER_TYPE_ID    :{super_admin:1,medical_department:2,accounts_department:3,welfare_department:4,empanelled_hospital:5,employe:6},
    
    
    
};