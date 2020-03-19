import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'amountFormat',
    pure: true
})
export class AmountFormatPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        var formatted_amount="";
        console.log(value);
        if (value!='') {  
        	console.log("Success");           	
        	value=Number(value);
            formatted_amount= "Tk "+(value.toFixed(2));
        }
        else{
        	formatted_amount= "Tk "+(value.toFixed(2));	
        }
        return formatted_amount;
    }

}