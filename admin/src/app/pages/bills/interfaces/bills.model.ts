export class BILLS {
  id: number;
  hospital: string;
  employee: string;
  hospital_submit_date: Date;
  medical_service_description: string;
  line_of_treatment: string;
  bill_documents: any;
  created_at: Date;
  updated_by: number;
  updated_at: Date;  
  labels: any;

  constructor(bills) {
    this.id = bills.id;
    this.hospital = bills.hospital;
    this.employee = bills.employee;
    this.hospital_submit_date = bills.hospital_submit_date;
    this.medical_service_description = bills.medical_service_description;
    this.line_of_treatment = bills.line_of_treatment;
    this.bill_documents = bills.bill_documents;
    this.created_at = bills.created_at;
    this.updated_by = bills.updated_by;
    this.labels = bills.labels;
  }
  
}
