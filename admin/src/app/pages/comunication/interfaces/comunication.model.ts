export class Comunication {
  id: number;
  remarks: string;
  cil_admin_comments: string;
  created_at: Date;
  labels:any;

  constructor(comunication) {
    this.id = comunication.id;
    this.remarks = comunication.remarks;
    this.cil_admin_comments = comunication.cil_admin_comments;
    this.created_at = comunication.created_at;
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
