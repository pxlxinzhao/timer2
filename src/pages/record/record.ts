import { CalendarPage } from '../calendar/calendar'
import { Component} from '@angular/core';
import { Constant } from '../helper/constant'
//import { DbHelper } from '../helper/db';
import { Dialogs } from 'ionic-native';
import { Extra } from '../helper/extra';
import { NavController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { Pouch } from  '../helper/pouch';
import { TimeHelper} from '../helper/time';
import { Platform } from 'ionic-angular';
import {RecordFilter} from './recordFilter'

@Component({
  selector: 'page-record',
  templateUrl: 'record.html'
})
export class RecordPage {
  categories:string[] = [];
  categoryByRecordIdMap: any = {};
  categoryCount: any = {};
  categoryNames: any = {};
  currentCategory: string = "";
  fromDate: Date;
  isCounting: boolean = false;
  isFiltered: boolean = false;
  newCategory: string = "";
  recordIdSelectedForCategoryChanging: any;
  records:any = {};
  refreshCallback: any = null;
  selectedCategoryId: any = "";
  titles: any = {};
  toDate: Date;
  totalCountByCategoryMap: any = {};
  totalTimeByCategoryMap: any = {};

  constructor(public navCtrl:NavController,
              private constant: Constant,
              //private dbHelper:DbHelper,
              private timeHelper:TimeHelper,
              private pop: PopoverController,
              private pouch: Pouch,
              private extra: Extra,
              private platform: Platform) {
    /**
     * for first time app started,insert into category table with default category
     */
    this.pouch.setDefaultCategory();
    this.currentCategory = this.pouch.getLocal(this.constant.CATEGORY_CURRENT) || this.constant.CATEGORY_DEFAULT;

    this.extra.getEvent.subscribe((data) => {
      if (data.fromDate || data.toDate){
        this.fromDate = data.fromDate ? data.fromDate : null;
        this.toDate = data.toDate ? data.toDate : null;
      }

      if (data.callback){
        this.refreshCallback = data.callback;
      }

      this.refresh();
    })
  }

  /**
   * life cycle events goes first
   */
  ionViewWillEnter() {
    this.refresh();
  }

  changeTitle(id, value){
    if (!value) return;

    let self = this;

    self.pouch.updateRecordTitle(id, value, function(){
      self.refresh();
    })
  }

  openTitleDialog(id){
    if (this.platform.is('core')){
      console.info('can only change title in a real device');
      return;
    }

    let self = this;

    Dialogs.prompt('Please enter a new title', 'New title', ['Ok','Cancel'], '')
      .then(function(result) {
        let input = result.input1;
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        let btnIndex = result.buttonIndex;

        if(btnIndex === 1){
          self.changeTitle(id, input);
          self.refresh();
        }
      });
  }

  confirmDelete(id){
    if (this.platform.is('core')){
      this.deleteRecord(id);
    }else{
      let self = this;

      Dialogs.confirm('Are you sure you want to delete this record?', 'Delete record', ['Ok','Cancel'])
        .then(function(result){
          //ok is 1, cancel is 2
          if (result === 1){
            self.deleteRecord(id);
          }
        })
    }
  }

  deleteRecord(id) {
    let self =this;

    this.pouch.deleteRecord(id, function(){
      self.refresh();
    })
  }

  showCategoryDropdown(id) {
    this.recordIdSelectedForCategoryChanging = id === this.recordIdSelectedForCategoryChanging ? '' : id;
    this.pouch.setLocal(this.constant.RECORD_SELECTED_TO_CHANGE_CATEGORY, id);
  }

  changeRecordCategory(id){
    let self = this;
    let newValue = this.categoryByRecordIdMap[id];

    this.pouch.updateRecordCategory(id, newValue, function(){
      self.refresh();
    })
  }

  setTitleId(id){
    this.selectedCategoryId = id;
  }

  refresh(){
    this.isFiltered = false;
    /**
     * set up current category
     * first try to use it from local storage which is passed from the timer page
     * else if not set use default category
     */
    let self = this;

    if (this.pouch.getLocal(this.constant.CATEGORY_SELECTED)){
      this.currentCategory = this.pouch.getLocal(this.constant.CATEGORY_SELECTED);
      /**
       * clear immediately because it should only be used once after
       * clicking on home page record
       */
      this.pouch.setLocal(this.constant.CATEGORY_SELECTED, '');
    }else if(this.currentCategory.length === 0 ){
      this.currentCategory = this.constant.CATEGORY_DEFAULT;
    }

    /**
     * create category drop down
     */
    this.pouch.getAllCategory().then((docs) =>{
      this.categories = this.pouch.getAsArray(docs);
    })

    /**
     * refresh records
     */
    this.pouch.getAll().then((docs) =>{

      /**
       * docs.rows is an array like object, thus use keys pipe to loop
       */
      let records = this.pouch.getAsArray(docs);

      /**
       * sort by time
       */
      records.sort((a, b) => b['doc'].timestamp -  a['doc'].timestamp);

      /**
       * use date filter
       */
      if (this.fromDate || this.toDate){
        this.isFiltered = true;
        records =  records.filter(function(it){
          let time = it['doc'].timestamp;

          /**
           * here we have some weird time zone issue
           * when reading a plain text, it considers it as a ISO time.
           * we need to do the mannul time zone conversion
           */

          return (!self.fromDate || self.timeHelper.justDate(time) >= self.timeHelper.convertISOStringToLocalMilliseconds(self.fromDate))
            && (!self.toDate || self.timeHelper.justDate(time)<= self.timeHelper.convertISOStringToLocalMilliseconds(self.toDate));
        })
      }
      /**
       * cache records to be used in the calendar page
       */
      this.pouch.setLocal("records", JSON.stringify(records));

      console.log('setting temp');
      this.pouch.setTemp("records", records);

      /**
       * calculate if a record is on a new date
       * @type {Array}
       */
      for (let j=0; j<records.length; j++){
        if (j==0) {
          records[j].doc.onNewDate = true;;
          continue;
        }

        let thisDate = this.timeHelper.justDate(records[j].doc.timestamp);
        let prevDate = this.timeHelper.justDate(records[j-1].doc.timestamp);

        if (thisDate == prevDate){
          records[j].doc.onNewDate = false;
        }else{
          records[j].doc.onNewDate = true;
        }
      }

      this.records = records;

      this.calculateTotalTimeAndCountTotalRecords(records);

      /**
       * set value to the 'change category' select
       */
      for (let i=0; i<records.length; i++){
        //console.log(records[i]);
        this.categoryByRecordIdMap[records[i].id] = records[i].doc.category;
      }

      /**
       * set current category for timer page
       */
      this.changeCurrentCategory();

      this.recordIdSelectedForCategoryChanging = "";

      /**
       * this is used for calendar page, to refresh record page first and then refresh calendar page itself
       */

      if (this.refreshCallback){
        this.refreshCallback();
        this.refreshCallback = null;
      }

    })
  }

  changeCurrentCategory(){
    this.pouch.setLocal(this.constant.CATEGORY_CURRENT, this.currentCategory);
  }

  calculateTotalTimeAndCountTotalRecords(records){
    this.totalTimeByCategoryMap = {};

    for (let k in records){
      let record = records[k];
      let duration = record.doc.duration;
      let category = record.doc.category;

      if (!this.totalTimeByCategoryMap[category]){
        this.totalTimeByCategoryMap[category] = 0;
        this.totalCountByCategoryMap[category] = 0;
      }

      this.totalTimeByCategoryMap[category] += duration;
      this.totalCountByCategoryMap[category] ++;
    }

    if (this.totalTimeByCategoryMap[this.currentCategory] && this.totalCountByCategoryMap[this.currentCategory]){
      let totalTime = this.totalTimeByCategoryMap[this.currentCategory].toString();
      let totalCount = this.totalCountByCategoryMap[this.currentCategory].toString();

      this.pouch.setLocal("totalTime", totalTime);
      this.pouch.setLocal("totalCount",totalCount);
    }

  }

  presentPopover(myEvent) {
    let popover = this.pop.create(RecordFilter);
    popover.present({
      ev: myEvent
    })
  }

  clearFilter(){
    this.fromDate = null;
    this.toDate = null;
    this.refresh();
  }

  switchToCalendar(){
    this.navCtrl.push(CalendarPage);
  }
}
