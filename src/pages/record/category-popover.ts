import { ViewController } from 'ionic-angular/index';
import { Component } from '@angular/core';
import { DbHelper } from '../helper/db';
import { Extra } from '../helper/extra';
import { Constant } from '../helper/constant'
import { Pouch } from  '../helper/pouch';


//import * as _ from 'underscore';

@Component({
    selector: 'page-popover',
    templateUrl: 'category-popover.html'
})
export class CategoryPopover {
    categories:string[] = [];

    constructor(private dbHelper:DbHelper,
                private extra: Extra,
                private viewCtrl: ViewController,
                private pouch: Pouch,
                private constant: Constant){
      this.pouch.getAllCategory().then((docs) =>{
        this.categories = this.pouch.getAsArray(docs);
      })
    }

    changeCategory(categoryName){
      /**
       * current record is used in about page for changing category
       * @type {any}
       */
      let self = this;
      let id = this.pouch.getLocal(this.constant.RECORD_SELECTED_TO_CHANGE_CATEGORY);

      this.pouch.updateRecordCategory(id, categoryName, function(){
        self.extra.refresh();
        self.close();
      })
    }

  close() {
    this.viewCtrl.dismiss();
  }
}
