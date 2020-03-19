import {Pipe, PipeTransform} from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateFormat',
    pure: true
})
export class DateFormatPipe implements PipeTransform {
    default_date_format='yyyy-MM-dd';
    date_format='dd-MM-yyyy';    
    time_format='hh:mm a';
    datetime_format='dd-MM-yyyy hh:mm a';

	constructor(private datePipe: DatePipe) {
    //this.addItems.achievement_date = datePipe.transform('2019-04-13T00:00:00', 'yyyy-MM-dd');
    // console.log(this.date)
  	}
    transform(value: any, arg1?: any,arg2?:any): any {
        var local_date=null;

        if (value) {            
            local_date=new Date(value);
            //console.log("arguments "+ arg1);
            if (arg1) {
            	if (arg1=="date") {
            		local_date=this.datePipe.transform(local_date, this.date_format);
            	}
            	else if (arg1=="time"){
            		local_date=this.datePipe.transform(local_date, this.time_format);
            	}
                else if (arg1=="datetime"){
                    local_date=this.datePipe.transform(local_date, this.datetime_format);
                }
            }
            else{
            	local_date=this.datePipe.transform(local_date, this.default_date_format);
            }
            
        }
        return local_date;
    }

}