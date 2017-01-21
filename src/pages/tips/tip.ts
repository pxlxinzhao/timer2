import { Component } from '@angular/core';

@Component({
  templateUrl: 'tip.html'
})
export class TipPage{
  tips: any = [];

  constructor(){
    this.tips.push('New record is created under selected category in "Records" tab.');
  }
}
