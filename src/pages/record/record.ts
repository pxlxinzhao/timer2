import { CategoryPopover} from './category-popover'
import { Component } from '@angular/core';
import { Constant } from '../helper/constant'
import { DbHelper } from '../helper/db';
import { Dialogs } from 'ionic-native';
import { Extra } from '../helper/extra';
import { NavController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { Pouch } from  '../helper/pouch';
import { TimeHelper} from '../helper/time';

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
              private constant: Constant,
              private dbHelper:DbHelper,
              private timeHelper:TimeHelper,
              private pop: PopoverController,
              private pouch: Pouch,
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
  //changeCategory(cat){
  //  console.log('currentCategory', cat);
  //  this.currentCategory = cat;
  //  this.refresh();
  //}

  /**
   * used to rename category
   */
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
    /**
     * setting up category
     */
    console.log('currentCategory1', this.currentCategory);

    if (this.pouch.getLocal(this.constant.CATEGORY_SELECTED)){
      console.log(1);
      this.currentCategory = this.pouch.getLocal(this.constant.CATEGORY_SELECTED);
      /**
       * clear immediately because it should only be used once after
       * clicking on home page record
       */
      this.pouch.setLocal(this.constant.CATEGORY_SELECTED, '');
    }else if(this.currentCategory.length === 0 ){
      console.log(2);

      this.currentCategory = this.constant.CATEGORY_DEFAULT;
    }

    console.log('currentCategory2', this.currentCategory);

    /**
     * refresh records
     */
    this.pouch.getAll().then((docs) =>{
      /**
       * docs.rows is an array list object, thus use keys pipe to loop
       */
      let records = this.pouch.getAsArray(docs);
      records.sort((a, b) => b['doc'].timestamp -  a['doc'].timestamp);
      //this.records = records;

      /**
       * count each category has how many records
       * @type {{}}
       */
      this.categoryCount = {};
      for (let key in records){
        this.addToCategory(records[key])
      }

      /**
       * generate category drop down
       */
      while(this.categories.length > 0){
        this.categories.pop();
      }
      this.categories = JSON.parse(window.localStorage['categories']);

      /**
       * filter out record that does not belong the category
       */
      //for (let k in records){
      //  if (records[k].doc.category != this.currentCategory){
      //    delete records[k];
      //  }
      //}

      this.records = records;

      this.calculateTotalTime(records);
    })

    //if (window.localStorage['records']) {
    //  let self = this;
    //  let records = JSON.parse(window.localStorage['records']);


    //}
  }

  calculateTotalTime(records){
    let total = 0;
    for (let k in records){
      total += records[k].doc.duration;
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
    if (typeof this.categoryCount[record.doc.category] === 'undefined'){
      this.categoryCount[record.doc.category ] = 1;
    }else{
      this.categoryCount[record.doc.category ]++;
    }
  }
}
