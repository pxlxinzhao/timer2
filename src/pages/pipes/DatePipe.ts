import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'dateFromMilli'})
export class DatePipe implements PipeTransform {
  transform(value) : any {
    return new Date(value/1).toISOString();
  }
}
