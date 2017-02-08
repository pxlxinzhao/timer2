import { ViewController } from 'ionic-angular/index';
import { Component } from '@angular/core';
import { DbHelper } from '../helper/db';
import { Extra } from '../helper/extra';
import { Constant } from '../helper/constant'
import { Pouch } from  '../helper/pouch';


//import * as _ from 'underscore';

@Component({
    selector: 'page-popover',
    templateUrl: 'recordFilter.html'
})
export class RecordFilter {

    fromDate: any;
    toDate: any;

    constructor(private dbHelper:DbHelper,
                private extra: Extra,
                private viewCtrl: ViewController,
                private pouch: Pouch,
                private constant: Constant){

      let timezoneOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - timezoneOffset)).toISOString();
      this.fromDate = localISOTime;
      this.toDate = localISOTime;
    }

  apply(){
    this.extra.refreshWithDate({
      fromDate: this.fromDate,
      toDate: this.toDate
    });

    this.pouch.setLocal('fromDate', this.fromDate);
    this.pouch.setLocal('toDate', this.toDate);
    this.close();
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
