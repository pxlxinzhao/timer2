import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { PopoverController } from 'ionic-angular';
import { DbHelper } from '../helper/db';
import { TimeHelper} from '../helper/time';
import { Extra } from '../helper/extra';
import { CategoryPopover} from './category-popover'

//import * as _ from 'underscore';

@Component({
  selector: 'page-record',
  templateUrl: 'record.html'
})
export class RecordPage {
  categories:string[] = [];
  currentCategory: string = "";
  newCategory: string = "";
  newId: string = "";
  records:any = {};
  titles: any = {};
  categoryNames: any = {};
  idForTitleChanging: any = ""
  idForCategoryChanging: any = ""
  categoryCount: any = {}
  totalTime: any;
  isCounting: boolean = false;

  constructor(public navCtrl:NavController,
              private dbHelper:DbHelper,
              private timeHelper:TimeHelper,
              private pop: PopoverController,
              private extra: Extra) {
    this.dbHelper = dbHelper;
    this.timeHelper = timeHelper;
    this.pop = pop;
    this.categories = this.dbHelper.get('categories');
    this.extra.getEvent.subscribe( (refresh) => {
      this.refresh();
    } );
  }

  /**
   * life cycle events goes first
   * then functions are order by names
   */
  ionViewWillEnter() {
    //this.extra.getEvent.subscribe( (switchToCategory) => {
    //  console.log('got it');
    //})
    this.refresh();
  }

  addCategory(newCategory){
    let c = this.dbHelper.get('categories');
    c.push(newCategory);
    this.dbHelper.save('categories', c);
  }

  selectCategory(c){
    this.idForCategoryChanging = c;
  }

  /**
   * used to show records of different category
   */
  changeCategory(cat){

    this.currentCategory = cat;
    this.refresh();
  }

  /**
   * used to rename category
   */
  //changeCategoryName(c){
  //  let self = this;
  //  let oldValue = c;
  //  let newValue = this.categoryNames[c];
  //
  //  if (newValue){
  //    //update category and records
  //    let records = JSON.parse(window.localStorage['records']);
  //    let categories = JSON.parse(window.localStorage['categories']);
  //
  //    for (let key in records){
  //      if (records[key].category === oldValue) records[key].category = newValue;
  //    }
  //
  //    for (let i=0; i<categories.length; i++){
  //      if (categories[i] === oldValue) categories[i] = newValue;
  //    }
  //
  //    window.localStorage['records'] = JSON.stringify(records);
  //    window.localStorage['categories'] = JSON.stringify(categories);
  //
  //    this.currentCategory = newValue;
  //  }
  //
  //  this.idForCategoryChanging = "";
  //
  //  setTimeout(() => {
  //    self.refresh();
  //  }, 1)
  //}

  changeTitle(){
    this.dbHelper.update('records', this.newId, 'title', this.titles[this.newId]);
    this.newId = "";
    this.idForTitleChanging = "";
    this.refresh();
  }

  confirmDelete(id){
    let self = this;

    Dialogs.confirm('Are you sure you want to delete this record?', 'Delete record', ['Ok','Cancel'])
      .then(function(result){
        //ok is 1, cancel is 2
        if (result === 1){
          self.deleteRecord(id);
        }
      })
  }

  deleteRecord(id) {
    this.dbHelper.delete('records', id);
    this.refresh();
  }

  formatDuration(milli){
    return this.timeHelper.formatTime(milli);
  }

  presentPopover(key) {
    let popover = this.pop.create(CategoryPopover);
    popover.present();
    window.localStorage['currentRecord'] = key;
  }

  setTitleKey(id){
    this.newId = id;
    this.idForTitleChanging = id;
  }

  refresh(){
    if (window.localStorage['currentCategory']){
      this.currentCategory = window.localStorage['currentCategory'];
      // clear immediately because it should only be used once after
      // clicking on home page record
      window.localStorage['currentCategory'] = "";
    }

    if (window.localStorage['records']) {
      let self = this;
      let records = JSON.parse(window.localStorage['records']);

      this.categoryCount = {};

      for (let key in records){
        this.addToCategory(records[key])
      }

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
      this.calculateTotalTime(records);
    }
  }

  calculateTotalTime(records){
    let total = 0;
    for (let k in records){
      total += records[k].duration;
    }
    this.totalTime = total;
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

  addToCategory(record){
    if (typeof this.categoryCount[record.category] === 'undefined'){
      this.categoryCount[record.category ] = 1;
    }else{
      this.categoryCount[record.category ]++;
    }
  }
}
