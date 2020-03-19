export class Estimations {
  id: number;
  hospital: string;
  employee: string;
  admission_number: string;
  date_of_admission: Date;
  doctor_name: string;
  total_estimated_amount: any;
  created_at: Date;
  updated_by: number;
  updated_at: Date;  
  labels: any;

  constructor(estimations) {
    this.id = estimations.id;
    this.hospital = estimations.hospital_name;
    this.employee = estimations.employee_name;
    this.admission_number = estimations.admission_number;
    this.date_of_admission = estimations.date_of_admission;
    this.doctor_name = estimations.doctor_name;
    this.total_estimated_amount = estimations.totaol_claimed_amount;
    this.created_at = estimations.created_at;
    this.updated_by = estimations.updated_by;
    this.labels = estimations.labels;
  }
  
}
