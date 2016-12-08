import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { DbHelper } from '../helper/db';
import { TimeHelper} from '../helper/time';
//import * as _ from 'underscore';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  dbHelper:DbHelper;
  timeHelper:TimeHelper;

  categories:string[] = [];
  currentCategory: string = "";
  newCategory: string = "";
  newId: string = "";
  records:any = {};
  titles: any = {};

  constructor(public navCtrl:NavController, dbHelper:DbHelper, timeHelper:TimeHelper) {
    this.dbHelper = dbHelper;
    this.timeHelper = timeHelper;
    this.categories = this.dbHelper.get('categories');
  }

  /**
   * life cycle events goes first
   * then functions are order by names
   */
  ionViewWillEnter() {
    this.refresh();
  }

  addCategory(newCategory){
    let c = this.dbHelper.get('categories');
    c.push(newCategory);
    this.dbHelper.save('categories', c);
  }

  changeCategory(cat){
    this.currentCategory = cat;
    this.refresh();
  }

  changeTitle(){
    this.dbHelper.update('records', this.newId, 'title', this.titles[this.newId]);
    this.newId = "";
    this.refresh();
  }

  deleteRecord(id) {
    this.dbHelper.delete('records', id);
    this.refresh();
  }

  setTitleKey(id){
    this.newId = id;
  }

  refresh(){
    if (window.localStorage['records']) {
      let self = this;
      let records = JSON.parse(window.localStorage['records']);

      //console.log('refresh', records);

      while(self.categories.length > 0){
        self.categories.pop();
      }

      /**
       * get category from category table
       */
      self.categories = JSON.parse(window.localStorage['categories']);

      /**
       * filter out record that does not belong the category
       */
      for (let k in records){
        if (records[k].category != self.currentCategory){
          delete records[k];
        }
      }

      this.records = records;
    }
  }

  showCategoryDialog(){
    let self = this;
    Dialogs.prompt('Enter a name', 'New Category', ['Ok','Cancel'], '')
      .then(function(result) {
        var input = result.input1;
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = result.buttonIndex;

        if(btnIndex === 1){
          self.newCategory = input;
          self.addCategory(input);
          self.refresh();
        }
      });
  }
}
