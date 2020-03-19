export class Hospital {
  id: number;
  name: string;
  address: string;
  description: string;
  logo: string;
  is_delete: number;
  deleted_remarks: string;
  created_by: number;
  created_at: Date;
  deleted_by: number;
  deleted_at: Date;
  bank_account_number: string;
  ifsc_code: string;
  bank_name: string;
  cghs_id: string;
  labels: any;

  constructor(hospital) {
    this.id = hospital.id;
    this.name = hospital.name;
    this.address = hospital.address;
    this.description = hospital.description;
    this.logo = hospital.logo;
    this.is_delete = hospital.is_delete;
    this.deleted_remarks = hospital.deleted_remarks;
    this.created_by = hospital.created_by;
    this.created_at = hospital.created_at;
    this.deleted_by = hospital.deleted_by;
    this.deleted_at = hospital.deleted_at;
    this.bank_account_number = hospital.bank_account_number;
    this.ifsc_code = hospital.ifsc_code;
    this.bank_name = hospital.bank_name;
    this.cghs_id = hospital.cghs_id;
    this.labels = hospital.labels;
  }

  /*get name() {
    let name = '';

    if (this.firstname && this.lastname) {
      name = this.firstname + ' ' + this.lastname;
    } else if (this.firstname) {
      name = this.firstname;
    } else if (this.lastname) {
      name = this.lastname;
    }

    return name;
  }

  set name(value) {
  }*/

  /*get address() {
    return `${this.street}, ${this.zipcode} ${this.city}`;
  }

  set address(value) {
  }*/
}
