  var schema = {};

  var sequelize = require('../config/sequalize');
  var Sequelize = require('sequelize');

  
  var moment = require('moment');

  
  schema.userSchema =   sequelize.define('user', {
                                        access_token: {
                                            type: Sequelize.STRING
                                        },
                                        user_type_id: {
                                            type: Sequelize.INTEGER
                                        },
                                        access_id: {
                                            type: Sequelize.STRING
                                        },
                                        firstname: {
                                            type: Sequelize.STRING
                                        },
                                        lastname: {
                                            type: Sequelize.STRING
                                        },
                                        email: {
                                          type:Sequelize.STRING
                                        },
                                        password: {
                                            type: Sequelize.STRING
                                        },
                                        mobile: {
                                            type: Sequelize.STRING
                                        },
                                        designation: {
                                            type: Sequelize.STRING
                                        },
                                        department: {
                                            type: Sequelize.STRING
                                        },
                                        status: {
                                            type: Sequelize.ENUM('0','1')
                                        },
                                        reset_token: {
                                            type: Sequelize.STRING
                                        },
                                        is_mobile_verified: {
                                            type: Sequelize.ENUM('0','1')
                                        },
                                        user_role: {
                                            type: Sequelize.ENUM('admin','data_entry')
                                        },
                                        is_delete: {
                                            type: Sequelize.INTEGER
                                        },
                                        verified_by_admin: {
                                            type: Sequelize.ENUM('yes','no')
                                        },
                                        created_by: {
                                            type: Sequelize.INTEGER
                                        },
                                        created_at: {
                                            type: Sequelize.DATE
                                        },
                                        updated_by: {
                                            type: Sequelize.INTEGER
                                        },
                                        updated_at: {
                                            type: Sequelize.DATE
                                        }
                                        
                                  },{
                                      tableName: 'users',
                                      "timestamps": false,
                                      "underscored": true,
                                  });


  schema.masterSchema =   sequelize.define('master', {
                                        user_id: {
                                            type: Sequelize.INTEGER
                                        },
                                        medical_card_number: {
                                            type: Sequelize.STRING
                                        },
                                        eis_number: {
                                            type: Sequelize.STRING
                                        },
                                        date_of_retirement: {
                                            type: Sequelize.DATE
                                        },
                                        retire_company_id: {
                                            type: Sequelize.INTEGER
                                        },
                                        bank_account_number: {
                                          type:Sequelize.STRING
                                        },
                                        ifsc_code: {
                                            type: Sequelize.STRING
                                        },
                                        bank_name: {
                                            type: Sequelize.STRING
                                        },
                                        pan_number: {
                                            type: Sequelize.STRING
                                        },
                                        adhaar_number: {
                                            type: Sequelize.STRING
                                        },
                                        life_certificate_id: {
                                            type: Sequelize.STRING
                                        },
                                        life_certificate_expired: {
                                            type: Sequelize.ENUM('yes','no')
                                        },
                                        card_status: {
                                            type: Sequelize.ENUM('active','inactive')
                                        },
                                        remarks: {
                                            type: Sequelize.STRING
                                        },
                                        bed_category: {
                                            type: Sequelize.STRING
                                        },
                                        medical_card_amount: {
                                            type: Sequelize.INTEGER
                                        },
                                        nodal_officer_accepted: {
                                            type: Sequelize.ENUM('yes','no')
                                        },
                                        registered_company_id: {
                                            type: Sequelize.INTEGER
                                        },
                                        retirement_grade: {
                                            type: Sequelize.STRING
                                        },
                                        cause_of_separation: {
                                            type: Sequelize.STRING
                                        },
                                        nodal_officer_accepted_date: {
                                            type: Sequelize.DATE
                                        },
                                        delete: {
                                            type: Sequelize.ENUM('yes','no')
                                        },
                                        created_by: {
                                            type: Sequelize.INTEGER
                                        },
                                        created_at: {
                                            type: Sequelize.DATE
                                        },
                                        updated_by: {
                                            type: Sequelize.INTEGER
                                        },
                                        updated_at: {
                                            type: Sequelize.DATE
                                        }
                                        
                                  },{
                                      tableName: 'master',
                                      "timestamps": false,
                                      "underscored": true,
                                  });

  schema.hospitalSchema = sequelize.define('hospital',{
                                      name: {
                                          type: Sequelize.STRING
                                      },
                                      address: {
                                          type: Sequelize.STRING
                                      },
                                      hospital_url: {
                                          type: Sequelize.STRING
                                      },
                                      description: {
                                          type: Sequelize.STRING
                                      },
                                      logo: {
                                          type: Sequelize.STRING
                                      },
                                      is_delete: {
                                          type: Sequelize.INTEGER
                                      },
                                      deleted_remarks: {
                                          type: Sequelize.STRING
                                      },
                                      created_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                      deleted_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      deleted_at: {
                                          type: Sequelize.DATE
                                      },
                                      bank_account_number: {
                                          type: Sequelize.STRING
                                      },
                                      ifsc_code: {
                                          type: Sequelize.STRING
                                      },
                                      bank_name: {
                                          type: Sequelize.STRING
                                      },
                                      bank_proof_document: {
                                          type: Sequelize.STRING
                                      },
                                      request_message: {
                                          type: Sequelize.STRING
                                      },
                                      approval_rejection_remarks: {
                                          type: Sequelize.STRING
                                      },
                                      approve_reject_document: {
                                          type: Sequelize.STRING
                                      },
                                      company_approved: {
                                          type: Sequelize.ENUM('yes','no')
                                      },
                                      approval_date: {
                                          type: Sequelize.DATE
                                      },
                                      approved_by: {
                                          type: Sequelize.STRING
                                      },

                                  },{
                                      tableName: 'hospitals',
                                      "timestamps": false,
                                      "underscored": true,
                                  });

  schema.cghsMasterSchema = sequelize.define('cghsMaster', {
                                      code: {
                                          type: Sequelize.STRING
                                      },
                                      dispensary_name: {
                                          type: Sequelize.STRING
                                      },
                                      location: {
                                          type: Sequelize.STRING
                                      },
                                      treatment_description: {
                                          type: Sequelize.STRING
                                      },
                                      rate: {
                                          type: Sequelize.STRING
                                      },
                                      is_delete: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                      updated_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      updated_at : {
                                          type: Sequelize.DATE
                                      }
                                  },{
                                      tableName: 'cghs_master',
                                      "timestamps": false,
                                      "underscored": true,
                                  });

 schema.contactUsSchema = sequelize.define('contact_us', {
                                      user_name: {
                                          type: Sequelize.STRING
                                      },
                                      message: {
                                          type: Sequelize.STRING
                                      },
                                      email: {
                                          type: Sequelize.STRING
                                      },
                                      contact_no: {
                                          type: Sequelize.STRING
                                      }, 
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'contact_us',
                                      "timestamps": false,
                                      "underscored": true,
                                  });

 schema.grievanceSchema = sequelize.define('grievance', {
                                      user_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      submitted_by_user: {
                                          type: Sequelize.ENUM('yes','no')
                                      },
                                      created_by: {
                                          type: Sequelize.STRING
                                      },
                                      gender:{
                                        type: Sequelize.ENUM('male','female','transgender')
                                      },
                                      email: {
                                          type: Sequelize.STRING
                                      },
                                      phone_no: {
                                          type: Sequelize.INTEGER
                                      },
                                      file_name: {
                                          type: Sequelize.STRING
                                      },
                                      state: {
                                          type: Sequelize.STRING
                                      },
                                      district: {
                                          type: Sequelize.STRING
                                      },
                                      address: {
                                          type: Sequelize.STRING
                                      },
                                      pin_code: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'grievance',
                                      "timestamps": false,
                                      "underscored": true,
                                  });


schema.grievanceComunicationSchema = sequelize.define('grievance_communication', {
                                      grievance_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      remarks_by_user: {
                                          type: Sequelize.STRING
                                      },
                                      remarks_by_company: {
                                          type: Sequelize.STRING
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                      updated_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'grievance_communication',
                                      "timestamps": false,
                                      "underscored": true,
                                  });

  
  schema.companiesSchema = sequelize.define('mst_companies', {
                                      code: {
                                          type: Sequelize.STRING
                                      },
                                      name: {
                                          type: Sequelize.STRING
                                      },
                                      description: {
                                          type: Sequelize.STRING
                                      },
                                      is_delete: {
                                          type: Sequelize.INTEGER
                                      },
                                      
                                  },{
                                      tableName: 'mst_companies',
                                      "timestamps": false,
                                      "underscored": true,
                                  });
  schema.otpSchema           =   sequelize.define('otp', {
                                        communication_details: {
                                            type: Sequelize.STRING
                                        },
                                        communication_mode: {
                                            type: Sequelize.ENUM('email','phone_no')
                                        },
                                        otp: {
                                            type: Sequelize.STRING
                                        },
                                        created_at: {
                                            type: Sequelize.DATE
                                        }
                                  },{
                                          tableName: 'otps',
                                          "timestamps": false,
                                          "underscored": true,

                                  });
schema.nomineeSchema           =   sequelize.define('nominee', {
                                        user_id: {
                                            type: Sequelize.STRING
                                        },
                                        nominee_image: {
                                            type: Sequelize.STRING
                                        },
                                        nominee_sign: {
                                            type: Sequelize.STRING
                                        },
                                        nominee_relationship: {
                                            type: Sequelize.STRING
                                        },
                                        nominee_address: {
                                            type: Sequelize.STRING
                                        },
                                        nominee_name: {
                                            type: Sequelize.STRING
                                        },
                                        updated_by: {
                                            type: Sequelize.INTEGER
                                        },
                                        created_at: {
                                            type: Sequelize.DATE
                                        },
                                        updated_at: {
                                            type: Sequelize.DATE
                                        }
                                  },{
                                          tableName: 'nominee',
                                          "timestamps": false,
                                          "underscored": true,

                                  });


schema.employeeSchema           =   sequelize.define('employee', {
                                        user_id: {
                                            type: Sequelize.STRING,
                                            primaryKey:true
                                        },
                                        employee_sign: {
                                            type: Sequelize.STRING
                                        },
                                        employee_image: {
                                            type: Sequelize.STRING
                                        },
                                        spouse_image: {
                                            type: Sequelize.STRING
                                        },
                                        spouse_sign: {
                                            type: Sequelize.STRING
                                        },
                                        employee_id: {
                                            type: Sequelize.STRING
                                        },
                                        company_id: {
                                            type: Sequelize.INTEGER
                                        },
                                        employee_name: {
                                            type: Sequelize.INTEGER
                                        },
                                        spouse_name: {
                                            type: Sequelize.STRING
                                        },
                                        date_of_joining: {
                                            type: Sequelize.DATE
                                        },
                                        date_of_retierment: {
                                            type: Sequelize.DATE
                                        },
                                        date_of_birth: {
                                            type: Sequelize.DATE
                                        },
                                        gender: {
                                            type: Sequelize.ENUM('male','female','transgender')
                                        },
                                        permanent_address: {
                                            type: Sequelize.STRING
                                        },
                                        present_address: {
                                            type: Sequelize.STRING
                                        },
                                        updated_by: {
                                            type: Sequelize.INTEGER
                                        },
                                        created_at: {
                                            type: Sequelize.DATE
                                        },
                                        updated_at: {
                                            type: Sequelize.DATE
                                        }
                                  },{
                                          tableName: 'employee',
                                          "timestamps": false,
                                          "underscored": true,

                                  });
schema.userHospitalSchema = sequelize.define('user_hospitals', {
                                      user_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      hospital_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'user_hospitals',
                                      "timestamps": false,
                                      "underscored": true,
                                  });
schema.estimationSchema = sequelize.define('estimation', {
                                      user_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      hospital_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      admission_number: {
                                          type: Sequelize.STRING
                                      },
                                      date_of_admission: {
                                          type: Sequelize.DATE
                                      },
                                      doctor_name: {
                                          type: Sequelize.STRING
                                      },
                                      provisional_diagnosis: {
                                          type: Sequelize.STRING
                                      },
                                      estimate_files: {
                                          type: Sequelize.STRING
                                      },
                                      plan_of_treatment: {
                                          type: Sequelize.STRING
                                      },
                                      total_estimated_amount: {
                                          type: Sequelize.INTEGER
                                      },
                                      approved_amount: {
                                          type: Sequelize.INTEGER
                                      },
                                      hospital_remarks: {
                                          type: Sequelize.STRING
                                      },
                                      medical_department_approval: {
                                          type: Sequelize.ENUM('Approved','Partially','Rejected','Pending')
                                      },
                                      account_department_approval: {
                                          type: Sequelize.ENUM('Approved','Partially','Rejected','Pending')
                                      },
                                      hospital_disclaimer: {
                                          type: Sequelize.STRING
                                      },
                                      created_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      updated_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                      updated_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'estimation',
                                      "timestamps": false,
                                      "underscored": true,
                                  });
schema.estimateParticularsSchema = sequelize.define('estimate_particulars', {
                                      estimation_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      particulars: {
                                          type: Sequelize.STRING
                                      },
                                      cghs_code: {
                                          type: Sequelize.STRING
                                      },
                                      amount: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'estimate_particulars',
                                      "timestamps": false,
                                      "underscored": true,
                                  });

schema.overallBillingSchema = sequelize.define('overall_billing', {
                                      user_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      admission_number: {
                                          type: Sequelize.STRING
                                      },
                                      hospital_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      medical_service_description: {
                                          type: Sequelize.STRING
                                      },
                                      total_cost: {
                                          type: Sequelize.INTEGER
                                      },
                                      hospital_submit: {
                                          type: Sequelize.ENUM('yes','no')
                                      },
                                      medical_department_approval: {
                                         type: Sequelize.ENUM('Approved','Partially','Rejected','Pending')
                                      },
                                      hospital_submit_date: {
                                          type: Sequelize.DATE
                                      },
                                      hospital_document_submit: {
                                          type: Sequelize.ENUM('yes','no')
                                      },
                                      company_approve_amount: {
                                          type: Sequelize.INTEGER
                                      },
                                      company_approve: {
                                          type: Sequelize.ENUM('Approved','Partially','Rejected','Pending')
                                      },
                                      final_diagnosis: {
                                          type: Sequelize.STRING
                                      },
                                      medical_department_comment: {
                                          type: Sequelize.STRING
                                      },
                                      line_of_treatment: {
                                          type: Sequelize.STRING
                                      },
                                      date_of_discharge: {
                                          type: Sequelize.DATE
                                      },
                                      discharge_summary_document: {
                                          type: Sequelize.STRING
                                      },
                                      company_approval_date: {
                                          type: Sequelize.DATE
                                      },
                                      created_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'overall_billing',
                                      "timestamps": false,
                                      "underscored": true,
                                  });


schema.billDocumentsSchema = sequelize.define('bill_documents', {
                                      user_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      hospital_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      bill_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      invoice_number: {
                                          type: Sequelize.INTEGER
                                      },
                                      document_name: {
                                          type: Sequelize.STRING
                                      },
                                      document_description: {
                                          type: Sequelize.STRING
                                      },
                                      amount: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'bill_documents',
                                      "timestamps": false,
                                      "underscored": true,
                                  });


schema.admittedEmployeeSchema = sequelize.define('admitted_employees', {
                                      admission_number: {
                                          type: Sequelize.STRING,
                                          primaryKey:true
                                      },
                                      date_of_admission: {
                                          type: Sequelize.DATE
                                      },
                                      status: {
                                          type: Sequelize.ENUM('Admitted','Discharged')
                                      },
                                      user_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      hospital_id: {
                                          type: Sequelize.STRING
                                      },
                                      created_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                      updated_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'admitted_employees',
                                      "timestamps": false,
                                      "underscored": true,
                                  });

schema.provisionalDiagnosisSchema = sequelize.define('provisional_diagnosis', {
                                      name: {
                                          type: Sequelize.STRING
                                      },
                                      description: {
                                          type: Sequelize.STRING
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      }
                                  },{
                                      tableName: 'provisional_diagnosis',
                                      "timestamps": false,
                                      "underscored": true,
                                  });

schema.HospitalCommunicationsSchema = sequelize.define('hospital_communications', {
                                      hospital_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      remarks: {
                                          type: Sequelize.STRING
                                      },
                                      created_by: {
                                          type: Sequelize.INTEGER
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                      cil_admin_comments: {
                                          type: Sequelize.STRING
                                      },
                                      is_read: {
                                          type: Sequelize.ENUM('0','1')
                                      }
                                  },{
                                      tableName: 'hospital_communications',
                                      "timestamps": false,
                                      "underscored": true,
                                  });

schema.lifeCertificateDetailsSchema = sequelize.define('life_certificate_details', {
                                      user_id: {
                                          type: Sequelize.INTEGER
                                      },
                                      certificate_name: {
                                          type: Sequelize.STRING
                                      },
                                      certificate_number: {
                                          type: Sequelize.STRING
                                      },
                                      start_date: {
                                          type: Sequelize.DATE
                                      },
                                      end_date: {
                                          type: Sequelize.DATE
                                      },
                                      created_at: {
                                          type: Sequelize.DATE
                                      },
                                      updated_at: {
                                          type: Sequelize.DATE
                                      },
                                  },{
                                      tableName: 'life_certificate_details',
                                      "timestamps": false,
                                      "underscored": true,
                                  });
//opdSchema
  schema.opdSchema = sequelize.define('emp_opd_claim', {
      accomodation_amount: {
          type: Sequelize.STRING
      },
      accomodation_date_from: {
          type: Sequelize.DATE
      },
      accomodation_date_to: {
          type: Sequelize.DATE
      },
      accomodation_rate: {
          type: Sequelize.STRING
      },
      amount_claimed: {
          type: Sequelize.STRING
      },
      grand_total: {
          type: Sequelize.STRING
      },
      medicine_amount: {
          type: Sequelize.STRING
      },
      surgery_amount: {
          type: Sequelize.STRING
      },
      total_consultation_amount: {
          type: Sequelize.STRING
      },
      total_medicine_amount: {
          type: Sequelize.STRING
      },
      total_injection_amount: {
          type: Sequelize.STRING
      },
      total_patho_amount: {
          type: Sequelize.STRING
      },
      created_by:{
          type: Sequelize.INTEGER
      },
      user_id:{
          type: Sequelize.INTEGER
      },
      created_at:{
          type: Sequelize.DATE
      },
      status:{
          type: Sequelize.INTEGER,default: 1
      },
      updated_at:{
          type: Sequelize.DATE
      },
      updated_by:{
          type: Sequelize.INTEGER
      },
      /*status: {
          type: Sequelize.INTEGER, enum: [1, 0], default: 1
      }*/
  },{
      tableName: 'emp_opd_claim',
      "timestamps": false,
      "underscored": true,
  });

  schema.consultationSchema = sequelize.define('opd_consultation', {
      opd_id: {
          type: Sequelize.STRING
      },
      amount: {
          type: Sequelize.STRING
      },
      invoice_file: {
          type: Sequelize.STRING
      },
      consultation_date: {
          type: Sequelize.DATE
      },

      created_at:{
          type: Sequelize.DATE
      },
      status:{
          type: Sequelize.INTEGER,default: 1
      },
      updated_at:{
          type: Sequelize.DATE
      },
      updated_by:{
          type: Sequelize.INTEGER
      },
      created_by:{
          type: Sequelize.INTEGER
      },
      /*status: {
          type: Sequelize.INTEGER, enum: [1, 0], default: 1
      }*/
  },{
      tableName: 'opd_consultation',
      "timestamps": false,
      "underscored": true,
  });
  //injectionSchema
  schema.injectionSchema = sequelize.define('opd_injection', {
      opd_id: {
          type: Sequelize.STRING
      },
      amount: {
          type: Sequelize.STRING
      },
      invoice_file: {
          type: Sequelize.STRING
      },
      inject_date: {
          type: Sequelize.DATE
      },

      created_at:{
          type: Sequelize.DATE
      },
      status:{
          type: Sequelize.INTEGER,default: 1
      },
      updated_at:{
          type: Sequelize.DATE
      },
      updated_by:{
          type: Sequelize.INTEGER
      },
      created_by:{
          type: Sequelize.INTEGER
      },
      /*status: {
          type: Sequelize.INTEGER, enum: [1, 0], default: 1
      }*/
  },{
      tableName: 'opd_injection',
      "timestamps": false,
      "underscored": true,
  });

  schema.medicineSchema = sequelize.define('opd_medicine', {
      opd_id: {
          type: Sequelize.STRING
      },
      amount: {
          type: Sequelize.STRING
      },
      invoice_file: {
          type: Sequelize.STRING
      },
      medicine_date: {
          type: Sequelize.DATE
      },

      created_at:{
          type: Sequelize.DATE
      },
      status:{
          type: Sequelize.INTEGER,default: 1
      },
      updated_at:{
          type: Sequelize.DATE
      },
      updated_by:{
          type: Sequelize.INTEGER
      },
      created_by:{
          type: Sequelize.INTEGER
      },
      /*status: {
          type: Sequelize.INTEGER, enum: [1, 0], default: 1
      }*/
  },{
      tableName: 'opd_medicine',
      "timestamps": false,
      "underscored": true,
  });

  schema.pathologySchema = sequelize.define('opd_pathology', {
      opd_id: {
          type: Sequelize.STRING
      },
      amount: {
          type: Sequelize.STRING
      },
      invoice_file: {
          type: Sequelize.STRING
      },
      patho_name: {
          type: Sequelize.STRING
      },

      created_at:{
          type: Sequelize.DATE
      },
      status:{
          type: Sequelize.INTEGER,default: 1
      },
      updated_at:{
          type: Sequelize.DATE
      },
      updated_by:{
          type: Sequelize.INTEGER
      },
      created_by:{
          type: Sequelize.INTEGER
      },
      /*status: {
          type: Sequelize.INTEGER, enum: [1, 0], default: 1
      }*/
  },{
      tableName: 'opd_pathology',
      "timestamps": false,
      "underscored": true,
  });

  module.exports = schema;
