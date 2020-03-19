export class Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  designation: string;
  verified_by_admin: string;
 

  constructor(employee) {
    this.id = employee.id;
    this.firstname = employee.firstname;
    this.lastname = employee.lastname;
    this.email = employee.email;
    this.mobile = employee.mobile;
    this.designation = employee.designation;
    this.verified_by_admin = employee.verified_by_admin; 
  }
  
}
