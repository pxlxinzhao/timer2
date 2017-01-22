import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({name: 'dateFromMilli'})
export class DatePipe implements PipeTransform {
  transform(value) : any {
    return moment(value/1).format('MM/DD/YY HH:mm');
  }
}
