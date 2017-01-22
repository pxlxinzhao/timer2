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

      this.toDate = new Date().toISOString();
    }


  close() {
    this.viewCtrl.dismiss();
  }
}
