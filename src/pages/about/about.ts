import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Helper } from '../helper/helper';
//import * as _ from 'underscore';


@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  categories:string[] = [];
  records:any = {};
  idForTitleChanging: string = "";
  titles: any = {};
  helper:Helper;
  currentCategory: string = "";
  newCategory: string = "";

  constructor(public navCtrl:NavController, helper:Helper) {
    this.helper = helper;

    /**
     * initiate categories with
     */
    if (!window.localStorage['categories']) {
      window.localStorage['categories'] = JSON.stringify(['Default category']);
    }
    this.categories = JSON.parse(window.localStorage['categories']);

  }

  addCategory(){
    let c = JSON.parse(window.localStorage['categories']);
  }

  changeCategory(cat){
    this.currentCategory = cat;
    this.refresh();
  }

  setTitleKey(id){
    this.idForTitleChanging = id;
  }

  changeTitle(){
    this.helper.update('records', this.idForTitleChanging, 'title', this.titles[this.idForTitleChanging]);
    this.idForTitleChanging = "";
    this.refresh();
  }

  addRecord(name:string, record:string) {
    if (this.records[name]) {
      console.info('Record ' + name + ' already exists');
    } else {
      this.records[name] = record;
    }
  }

  ionViewWillEnter() {
    this.refresh();
  }

  deleteRecord(id) {
    console.log('deleteRecord', id);
    this.helper.delete('records', id);
    this.refresh();
  }

  refresh(){
    if (window.localStorage['records']) {
      let self = this;
      let records = JSON.parse(window.localStorage['records']);

      console.log('refresh', records);

      while(self.categories.length > 0){
        self.categories.pop();
      }

      /**
       * @deprecated
       * using records to store category, not efficient
       */
      //for (let key in records){
      //  let c = records[key].category;
      //
      //  if (self.categories.indexOf(c) === -1){
      //    self.categories.push(c);
      //  }
      //}

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
}
