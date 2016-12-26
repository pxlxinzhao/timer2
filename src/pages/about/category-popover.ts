import { ViewController } from 'ionic-angular/index';
import { Component } from '@angular/core';
import { DbHelper } from '../helper/db';
import { Extra } from '../helper/extra';

//import * as _ from 'underscore';

@Component({
    selector: 'page-popover',
    templateUrl: 'category-popover.html'
})
export class CategoryPopover {
    categories:string[] = [];

    constructor(private dbHelper:DbHelper, private extra: Extra, private viewCtrl: ViewController){
      this.categories = this.dbHelper.get('categories');
    }

    changeCategory(value){
      let key = window.localStorage['currentRecord'];
      this.dbHelper.update('records', key, 'category', value);
      this.extra.refresh();
      this.close();
    }

  close() {
    this.viewCtrl.dismiss();
  }
}
