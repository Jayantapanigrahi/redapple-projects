export class CGHS {
  id: number;
  code: string;
  dispensary_name: string;
  location: string;
  treatment_description: string;
  rate: string;
  is_delete: number;
  created_by: number;
  created_at: Date;
  updated_by: number;
  updated_at: Date;  
  labels: any;

  constructor(cghs) {
    this.id = cghs.id;
    this.code = cghs.code;
    this.dispensary_name = cghs.dispensary_name;
    this.location = cghs.location;
    this.treatment_description = cghs.treatment_description;
    this.is_delete = cghs.is_delete;
    this.created_by = cghs.created_by;
    this.created_at = cghs.created_at;
    this.updated_by = cghs.updated_by;
    this.updated_at = cghs.updated_at;
    this.labels = cghs.labels;
  }
  
}
