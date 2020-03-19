var express = require('express');
var router = express.Router();
var constants = require("../config/constants");
var fileUpload= require("../middleware/FileUpload");
var authentication= require("../middleware/Auth");
var io;

//process.env.TZ = 'Asia/Kolkata' ;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Coal India' });
});

/**
 * Import All controller
 */

var adminUserController = require('../controllers/AdminUserController');
var adminHospitalController = require('../controllers/AdminHospitalController');
var adminController = require('../controllers/AdminController');
var adminCGHSController = require('../controllers/AdminCGHSController');
var adminRolesResponsibilityController = require('../controllers/AdminRolesResponsibilityController');
var contactUsController = require('../controllers/ContactUsController');
var grievanceController = require('../controllers/GrievanceController');
var notificationController = require('../controllers/NotificationController');
var masterController = require('../controllers/MasterController');
var otpController            = require('../controllers/OtpController');
var userController            = require('../controllers/UserController');
var employeeController            = require('../controllers/EmployeeController');
var hospitalController            = require('../controllers/HospitalController');
var opdController=require('../controllers/opdController');
var opdGetController=require('../controllers/opdGetController');
var adminProvisionalDiagnosisController=require('../controllers/AdminProvisionalDiagnosisController');
///////////////Master Data Route/////////////////////
router.get('/company-list',masterController.companyList);
router.post('/cghss-list',adminCGHSController.allCGHSsList);



////User Routes
router.post('/generate-otp',otpController.generateOtp);
router.post('/check-otp',otpController.checkOtp);
router.post('/generate-login-otp',otpController.generateLoginOtp);
router.post('/employee-details',authentication.authChecker,employeeController.employeeDetails);
router.post('/get-med-profile',authentication.authChecker,employeeController.medProfileDetails);
router.post('/employee-get-life-certificate',authentication.authChecker,employeeController.getCertificate);
router.post('/employee-estimation-list',authentication.authChecker,employeeController.estimateList);
router.post('/employee/get-bill',authentication.authChecker,employeeController.billList);
router.post('/employee-update',authentication.authChecker,fileUpload.userSignUp.fields([{ name: 'img_executive', maxCount: 1 },{ name: 'img_spouse', maxCount: 1 },{ name: 'img_nominee', maxCount: 1 },{ name: 'sign_nominee', maxCount: 1 },{ name: 'sign_spouse', maxCount: 1 },{ name: 'sign_executive', maxCount: 1 }]),employeeController.updateEmployee);
router.post('/employee-life-certificate-update',authentication.authChecker,fileUpload.addLifeCertificate.single('life_certificate'),employeeController.updateLifeCertificate);


//////WEBSITE ROUTE /////////////
router.post('/empanelled-hospitals-list',adminHospitalController.allHospitalsList);
router.post('/contact-us',contactUsController.addContactUs);
router.post('/user/registration',fileUpload.userSignUp.fields([{ name: 'img_executive', maxCount: 1 },{ name: 'img_spouse', maxCount: 1 },{ name: 'img_nominee', maxCount: 1 },{ name: 'sign_nominee', maxCount: 1 },{ name: 'sign_spouse', maxCount: 1 },{ name: 'sign_executive', maxCount: 1 }]),userController.userRegistration);
router.post('/user/login',userController.userLogin);

////##### Hospital Route ////////
router.post('/hospital/registration',fileUpload.hospitalSignUp.fields([{ name: 'bank_proof_document', maxCount: 1 },{ name: 'logo', maxCount: 1 }]),userController.hospitalRegistration);
router.post('/hospital/profile-update',authentication.authChecker,fileUpload.hospitalSignUp.fields([{ name: 'bank_proof_document', maxCount: 1 },{ name: 'logo', maxCount: 1 }]),hospitalController.updateHospitalProfile);
router.post('/hospital-details',authentication.authChecker,hospitalController.hospitalDetails);
router.post('/create-hospital-user',authentication.authChecker,hospitalController.createHospitalUser);
router.post('/get-hospital-user',authentication.authChecker,hospitalController.getHospitalUser);
router.post('/update-hospital-user',authentication.authChecker,hospitalController.updateHospitalUser);
router.post('/get-cil-employees',authentication.authChecker,hospitalController.getCILEmployees);
router.post('/hospital/get-admission-number',authentication.authChecker,hospitalController.getAdmissionNo);
router.post('/add-estimation',authentication.authChecker,fileUpload.addEstimation.single('estimate_files'),hospitalController.addEstimation);
router.post('/add-bill',authentication.authChecker,fileUpload.uploadBillFiles.fields([
		{ name: 'discharge_files', maxCount: 1 },
		{ name: 'invoice_images', maxCount: 20 },
	]),hospitalController.addBill);
router.post('/hospital/get-bill',authentication.authChecker,hospitalController.getBill);
router.post('/hospital/delete-bill',authentication.authChecker,hospitalController.deleteBill);
router.post('/hospital/update-bill',authentication.authChecker,hospitalController.updateBill);
router.post('/hospital/get-estimations',authentication.authChecker,hospitalController.estimateList);
router.post('/hospital/add-comunication',authentication.authChecker,hospitalController.addComunication);
router.post('/hospital/get-comunication',authentication.authChecker,hospitalController.getComunication);
router.post('/hospital/get-admission-details',authentication.authChecker,hospitalController.getAdmitedEmployeeDetails);
router.post('/hospital/get-medical-history',authentication.authChecker,hospitalController.getMedicalHistory);

//get-opd-user


router.post('/add-grievance',grievanceController.addGrievance);
router.post('/get-grievance',grievanceController.getGrievance);
//router.post('/emp-opd',opdController.setOpd);

router.post('/emp-opd',authentication.authChecker,fileUpload.uploadOpdFiles.fields([
	{ name: 'consultation_file', maxCount: 20 },
	{ name: 'injection_file', maxCount: 20 },
	{ name: 'medicine_file', maxCount: 20 },
	{ name: 'pathology_file', maxCount: 20 },
]),opdController.setOpd);
router.post('/get-opd-user',authentication.authChecker,opdGetController.getOpd);
//delete-opd
router.post('/delete-opd',authentication.authChecker,opdGetController.deleteOpd);


//get-opd-user

/** ROUTING**/

//Admin

router.post('/admin/login',adminUserController.adminLogin);

router.post('/admin/users-list',authentication.authChecker,adminUserController.allUsersList);
router.post('/admin/edit-user',authentication.authChecker,adminUserController.editUser);

router.post('/admin/hospitals-list',authentication.authChecker,adminHospitalController.allHospitalsList);
router.post('/admin/edit-hospital',authentication.authChecker,adminHospitalController.editHospital);
//router.post('/admin/edit-hospital',fileUpload.hospital.single('file'),adminHospitalController.editHospital);
router.post('/admin/add-hospital',authentication.authChecker,adminHospitalController.addHospital);

router.post('/admin/cghss-list',authentication.authChecker,adminCGHSController.allCGHSsList);
router.post('/admin/edit-cghs',authentication.authChecker,adminCGHSController.editCGHS);
router.post('/admin/add-cghs',authentication.authChecker,adminCGHSController.addCGHS);
router.post('/admin/cghs-details',authentication.authChecker,adminCGHSController.detailsCGHS);

router.post('/admin/pd-list',authentication.authChecker,adminProvisionalDiagnosisController.allPDsList);
router.post('/admin/edit-pd',authentication.authChecker,adminProvisionalDiagnosisController.editPD);
router.post('/admin/add-pd',authentication.authChecker,adminProvisionalDiagnosisController.addPD);
router.post('/admin/pd-details',authentication.authChecker,adminProvisionalDiagnosisController.detailsPD);

router.post('/admin/medical-department-list',authentication.authChecker,adminRolesResponsibilityController.allRolesResponsibilityList);
router.post('/admin/edit-medical-department',authentication.authChecker,adminRolesResponsibilityController.editRolesResponsibility);
router.post('/admin/add-medical-department',authentication.authChecker,adminRolesResponsibilityController.addRolesResponsibility);
router.post('/admin/medical-department-details',authentication.authChecker,adminRolesResponsibilityController.detailsRolesResponsibility);

//Routing for Admin Department menu
router.post('/admin/billss-list',authentication.authChecker,hospitalController.getBillsByAdmin);
router.post('/admin/estimations-list',authentication.authChecker,adminController.getEstimations);
router.post('/admin/edit-estimations',authentication.authChecker,adminController.updateEstimations);
router.post('/admin/edit-bills',authentication.authChecker,hospitalController.adminUpdateBill);
router.post('/admin/employee-list',authentication.authChecker,employeeController.getEmployees);
router.post('/admin/edit-employee',authentication.authChecker,employeeController.updateEmployeeCommon);
router.post('/admin/employee-details',authentication.authChecker,employeeController.employeeDetails);
router.post('/admin/dashboard-listing',authentication.authChecker,adminController.dashboardListing);
router.post('/admin/comunication-listing',authentication.authChecker,adminController.getComunication);
router.post('/admin/edit-comunication',authentication.authChecker,adminController.editComunication);
router.post('/admin/add-employee',authentication.authChecker,
	fileUpload.userSignUp.fields([
	{ name: 'img_executive', maxCount: 1 },
	{ name: 'img_spouse', maxCount: 1 },
	{ name: 'img_nominee', maxCount: 1 },
	{ name: 'sign_nominee', maxCount: 1 },
	{ name: 'sign_spouse', maxCount: 1 },
	{ name: 'sign_executive', maxCount: 1 }]),
	userController.addEmployeeAdmin);
router.post('/admin/check-token',adminUserController.checkToken);



module.exports = router;
