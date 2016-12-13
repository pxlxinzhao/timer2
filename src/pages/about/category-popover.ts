import { Component } from '@angular/core';
import { DbHelper } from '../helper/db';

//import * as _ from 'underscore';

@Component({
    selector: 'page-popover',
    templateUrl: 'category-popover.html'
})
export class CategoryPopover {
    categories:string[] = [];
    dbHelper:DbHelper;

    constructor(dbHelper:DbHelper){
      this.dbHelper = dbHelper;
      this.categories = this.dbHelper.get('categories');
    }

    changeCategory(value){
      let key = window.localStorage['currentRecord'];

      this.dbHelper.update('records', key, 'category', value);
    }
}
