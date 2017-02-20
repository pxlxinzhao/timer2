import { Component } from '@angular/core';

@Component({
  templateUrl: 'tip.html'
})
export class TipPage{
  tips: any = [];

  constructor(){
    //this.tips.push('New record is created under the chosen category which you can change in "Records" tab');
    //this.tips.push('Press and hold the filter icon to clear the date filter');
    //this.tips.push('Turn off safe deletion option then you can delete records quickly without confirmation');
  }
}
