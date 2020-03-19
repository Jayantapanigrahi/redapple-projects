export class RolesAndResponsibility {
  id: number;
  employee_id: string;
  mobile: string;
  email: string;
  firstname: string;
  lastname: string;
  department: string;
  designation:string
  company_id:number
  is_delete: number;
  created_by: number;
  created_at: Date;
  updated_by: number;
  updated_at: Date;  
  labels: any;

  constructor(rolesandresponsibility) {
    this.id = rolesandresponsibility.id;
    this.employee_id = rolesandresponsibility.employee_id;
    this.mobile = rolesandresponsibility.mobile;
    this.email = rolesandresponsibility.email;
    this.firstname = rolesandresponsibility.firstname;
    this.lastname = rolesandresponsibility.lastname;
    this.department = rolesandresponsibility.department;
    this.designation = rolesandresponsibility.designation;
    this.company_id = rolesandresponsibility.company_id;
    this.is_delete = rolesandresponsibility.is_delete;
    this.created_by = rolesandresponsibility.created_by;
    this.created_at = rolesandresponsibility.created_at;
    this.updated_by = rolesandresponsibility.updated_by;
    this.updated_at = rolesandresponsibility.updated_at;
    this.labels = rolesandresponsibility.labels;
  }
  
}
