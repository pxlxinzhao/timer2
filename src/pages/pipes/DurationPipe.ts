import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'duration'})
export class DurationPipe implements PipeTransform {
  transform(value) : any {
    let hours = "00"
    let minutes = "00";
    let seconds = "00";

    hours = Math.floor(value/3600000).toString();
    minutes = Math.floor(value%3600000/60000).toString();
    seconds = Math.floor(value%60000/1000).toString();

    hours = this.prependZero(hours, 2);
    minutes = this.prependZero(minutes, 2);
    seconds = this.prependZero(seconds, 2);

    return hours + ":" + minutes + ":" + seconds
  }

  prependZero(it, totalDigits){
    if (it.length < totalDigits){
      return this.prependZero("0".repeat(totalDigits - it.length) + it, totalDigits);
    }else{
      return it
    }
  }
}
