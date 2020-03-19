import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'applicationStatus',
    pure: true
})
export class ApplicationStatusPipe implements PipeTransform {

    transform(value: any, type?: any): any {
        var status=value;
            if (value=='admin') {            
                status='Admin';
            }
            else if (value=='data_entry') {
                status="Data Entry";
            }
            else if (value=='medical_department') {
                status="Medical Ddepartment";
            }
            else if (value=='male') {
                status="Male";
            }
            else if (value=='female') {
                status="Female";
            }
            else if (value=='transgender') {
                status="Transgender";
            }
            
        return status;
    }

}