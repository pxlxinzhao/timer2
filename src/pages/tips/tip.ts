import { Component } from '@angular/core';

@Component({
  templateUrl: 'tip.html'
})
export class TipPage{
  tips: any = [];

  constructor(){
    this.tips.push('New record is created under the chosen category');
    this.tips.push('Press the filter icon to clear the date filter');
  }
}
