var fs = require('fs');

var multer  = require('multer');
var path = require('path');
/** IMAGE FILE UPLOADING**/
var fileUpload={}
fileUpload.uploadSingle =  multer({ storage: multer.diskStorage({
        destination: function(req, file, callback) {
            console.log("1")
           callback(null, './public/images/users_images');

        },
        filename: function(req, file, callback,next) {
            console.log("2",file)
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
                callback({status:0})
            }else {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        },
        onError: function(err, next){
            console.log("error", err);
            next(err);
        }
    })
});

fileUpload.userSignUp =  multer({ storage: multer.diskStorage({
        destination: function(req, file, callback) {
            //console.log(file)
            if(file.fieldname == "img_executive" || file.fieldname == "img_spouse" || file.fieldname == "img_nominee")
              callback(null, './public/images/user_images/avatar/');
            else if (file.fieldname == "sign_executive" || file.fieldname == "sign_spouse" || file.fieldname == "sign_nominee")   
              callback(null, './public/images/user_images/signeture/');

        },
        filename: function(req, file, callback,next) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
                callback({status:0})
            }else {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        },
        onError: function(err, next){
            console.log("error", err);
            next(err);
        }
    })
});


fileUpload.hospitalSignUp =  multer({ storage: multer.diskStorage({
        destination: function(req, file, callback) {
            //console.log(file)
            if(file.fieldname == "bank_proof_document")
              callback(null, './public/images/hospital_images/bank/');
            else if (file.fieldname == "logo")   
              callback(null, './public/images/hospital_images/avatar/');

        },
        filename: function(req, file, callback,next) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
                callback({status:0})
            }else {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        },
        onError: function(err, next){
            console.log("error", err);
            next(err);
        }
    })
});

fileUpload.addEstimation =  multer({ storage: multer.diskStorage({
        destination: function(req, file, callback) {
             console.log("req====", req)
            console.log("file===", file)
            console.log(file)
            if(file.fieldname == "estimate_files")
              callback(null, './public/images/estimations/');

        },
        filename: function(req, file, callback,next) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
                callback({status:0})
            }else {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        },
        onError: function(err, next){
            console.log("error", err);
            next(err);
        }
    })
});

fileUpload.addLifeCertificate =  multer({ storage: multer.diskStorage({
        destination: function(req, file, callback) {
            console.log(req.file)
            if(file.fieldname == "life_certificate")
              callback(null, './public/images/user_images/life-certificate/');

               },
        filename: function(req, file, callback,next) {
            var ext = path.extname(file.originalname);
            console.log(ext)
            if (ext !== '.pdf') {
                callback({status:0})
            }else {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
        },
        onError: function(err, next){
            console.log("error", err);
            next(err);
        }
    })
});


fileUpload.uploadBillFiles =  multer({ storage: multer.diskStorage({
        destination: function(req, file, callback) {
            // console.log("req====", req)
            // console.log("file===", file)

            if(file.fieldname == "discharge_files" )
              callback(null, './public/images/bills/');

            else if(file.fieldname == "invoice_images" ) 
              callback(null, './public/images/bills/');
        },
        filename: function(req, file, callback,next) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf') {
                callback({status:0})
            }else {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
            // callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        },
        onError: function(err, next){
            console.log("error", err);
            next(err);
        }
    })
});

fileUpload.uploadOpdFiles =  multer({ storage: multer.diskStorage({

        destination: function(req, file, callback) {
            // console.log("req====", req)
            // console.log("file===", file)

                if(file.fieldname == "consultation_file" )
                //callback(null, __dirname);
                callback(null, path.join(__dirname,"..","/public","/images/opd/consultation/"))
                //callback(null, path.join(__dirname, './public/images/opd/'))
                //callback(null, './public/images/opd/');

               else if(file.fieldname == "injection_file" )
                    callback(null, path.join(__dirname,"..","/public","/images/opd/injection/"))
                else if(file.fieldname == "medicine_file" )
                    callback(null, path.join(__dirname,"..","/public","/images/opd/medicine/"))
                else if(file.fieldname == "pathology_file" )
                    callback(null, path.join(__dirname,"..","/public","/images/opd/pathology/"))
           },






        filename: function(req, file, callback,next) {
            var ext = path.extname(file.originalname);
            if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.pdf' && ext !== '.pdf') {
                callback({status:0})
            }else {
                callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
            }
            // callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        },
        onError: function(err, next){
            console.log("error", err);
            next(err);
        }

    })
});
module.exports =fileUpload;