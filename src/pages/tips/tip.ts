import { Component, ViewChild  } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
  templateUrl: 'tip.html'
})
export class TipPage{
  @ViewChild('tipSlide') slides: Slides;

  tips: any = [];

  constructor(){
    //this.tips.push('New record is created under the chosen category which you can change in "Records" tab');
    //this.tips.push('Press and hold the filter icon to clear the date filter');
    //this.tips.push('Turn off safe deletion option then you can delete records quickly without confirmation');


  }

  ngAfterViewInit() {
    console.log('slides', this.slides);
  }
}
