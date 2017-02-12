import { ViewController } from 'ionic-angular/index';
import { Component } from '@angular/core';
import { DbHelper } from '../helper/db';
import { TimeHelper } from '../helper/time';
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
    totalTime: any;
    totalCount: any;

    constructor(private dbHelper:DbHelper,
                private timeHelper: TimeHelper,
                private extra: Extra,
                private viewCtrl: ViewController,
                private pouch: Pouch,
                private constant: Constant){

      let timezoneOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
      let localISOTime = (new Date(Date.now() - timezoneOffset)).toISOString();
      this.fromDate = this.pouch.getLocal('fromDate') || localISOTime;
      this.toDate = this.pouch.getLocal('toDate') || localISOTime;
      this.totalTime = this.pouch.getLocal('totalTime');
      this.totalCount = this.pouch.getLocal('totalCount');
    }

  apply(){
    this.extra.refreshRecords({
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
