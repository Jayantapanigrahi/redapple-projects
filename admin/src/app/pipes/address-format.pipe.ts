import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'addressFormat',
    pure: true
})
export class AddressFormatPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        var formatted_address="";
        if (value) {            
            if (value.address) {
                formatted_address=value.address;
            }
            if (value.street_address) {
                formatted_address=formatted_address+(formatted_address.length>0?',':'')+value.street_address;
            }
            if (value.region && value.region.name.length>0) {
                formatted_address=formatted_address+(formatted_address.length>0?"\n ":'')+value.region.name;
            }
            if (value.city && value.city.name.length>0) {
                formatted_address=formatted_address+(formatted_address.length>0?' - ':'')+value.city.name;
            }
            if (value.area && value.area.name.length>0) {
                formatted_address=formatted_address+(formatted_address.length>0?' - ':'')+value.area.name;
            }

            
        }
        return formatted_address;
    }

}