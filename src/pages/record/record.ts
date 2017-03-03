import { CalendarPage } from '../calendar/calendar'
import { CategoryPage } from '../category/category'
import { Component} from '@angular/core';
import { Constant } from '../helper/constant'
import { Dialogs } from 'ionic-native';
import { Extra } from '../helper/extra';
import { NavController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { Pouch } from  '../helper/pouch';
import { TimeHelper} from '../helper/time';
import { Platform } from 'ionic-angular';
import {RecordFilter} from './recordFilter'
import * as _ from 'underscore'


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
  records:any = {};
  refreshCallback: any = null;
  selectedCategoryId: any = "";
  titles: any = {};
  toDate: Date;
  totalTime: any;
  totalCount: any;
  selectedRecords: any = [];
  allRecordKeys: any = [];
  selectAll: boolean = false;

  constructor(public navCtrl:NavController,
              private constant: Constant,
              private timeHelper:TimeHelper,
              private pop: PopoverController,
              private pouch: Pouch,
              private extra: Extra,
              private platform: Platform) {

    this.extra.getEvent.subscribe((data) => {
      if (data.clear){
        this.fromDate = null;
        this.toDate = null;
      }

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

  ionViewWillEnter() {
    console.log('refresh??');
    this.refresh();
  }

  changeTitle(id, value){
    if (!value) return;

    let self = this;

    self.pouch.updateRecordTitle(id, value, function(){
      self.refresh();
    })
  }

  openTitleDialog($event, id, title){
    $event.stopPropagation();

    if (this.platform.is('core')){
      console.info('can only change title in a real device');
      return;
    }

    let self = this;

    Dialogs.prompt('', 'New title', ['Ok','Cancel'], title)
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

  confirmDelete(){
    // || !(this.pouch.getLocal('safeDeletion') !== 'false')

    if (this.platform.is('core')){
      this.deleteRecord();
    }else{
      let message = 'Are you sure you want to delete ' +this.selectedRecords.length
        + ' record' + (this.selectedRecords.length > 1 ? 's' : '') + '?';

      let title =  'Delete record' + (this.selectedRecords.length > 1 ? 's' : '');

      Dialogs.confirm(message, title, ['Ok','Cancel'])
        .then((result)=>{
          //ok is 1, cancel is 2
          if (result === 1){
            this.deleteRecord();
          }
        })
    }
  }

  deleteRecord() {
    let count = this.selectedRecords.length;

    for (let i=0; i<this.selectedRecords.length; i++){
      let id = this.selectedRecords[i];

      this.pouch.deleteRecord(id,()=>{
        if (--count === 0){
          this.refresh();
        }
    })
    }
  }

  changeRecordsCategory(){
    if (!this.newCategory || this.newCategory == this.currentCategory) return;
    let count = this.selectedRecords.length;

    for (let i=0; i<this.selectedRecords.length; i++){
      let id = this.selectedRecords[i];
      this.pouch.updateRecordCategory(id, this.newCategory, ()=>{
        if (--count === 0){
          this.selectedRecords = [];
          this.refresh();
        }
      })
    }
  }

  setTitleId(id){
    this.selectedCategoryId = id;
  }

  refresh(){
    let self = this;
    this.isFiltered = false;
    this.selectAll = false;
    this.newCategory = "";

    /**
     * create category drop down
     */
    this.pouch.getAllCategory().then((docs) =>{
      this.categories = this.pouch.getAsArray(docs);
      this.currentCategory = this.pouch.getLocal(this.constant.CATEGORY_CURRENT);
      this.newCategory = this.currentCategory;
    })

    /**
     * refresh records
     */
    this.pouch.getAll().then((docs) =>{

      /**
       * docs.rows is an array like object, thus use keys pipe to loop
       */
      let records = this.pouch.getAsArray(docs);

      records = records.filter((x) => {
        return x['doc'].category == this.currentCategory;
      });

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
           * we need to do the manual time zone conversion
           */
          return (!self.fromDate || self.timeHelper.justDate(time) >= self.timeHelper.convertISOStringToLocalMilliseconds(self.fromDate))
            && (!self.toDate || self.timeHelper.justDate(time)<= self.timeHelper.convertISOStringToLocalMilliseconds(self.toDate));
        })
      }
      /**
       * cache records to be used in the calendar page
       */
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

      this.allRecordKeys = _.map(records, (x)=>{return x.id})
      this.records = records;

      this.calculateTotal();

      /**
       * set value to the 'change category' select
       */
      for (let i=0; i<records.length; i++){
        this.categoryByRecordIdMap[records[i].id] = records[i].doc.category;
      }

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
    this.refresh();
  }

  calculateTotal(){
    let records = this.records;
    let totalTime = 0;

    for (let k in records){
      let duration = records[k].doc.duration;
      totalTime += duration;
    }

    this.totalTime = totalTime;
    this.totalCount = this.records.length;
  }

  presentPopover(myEvent) {
    let popover = this.pop.create(RecordFilter);
    popover.present({
      ev: myEvent
    })
  }

  switchToCalendar(){
    this.navCtrl.push(CalendarPage);
  }

  manageCategory(){
    this.navCtrl.push(CategoryPage);
  }

  toggleRecord(id){
    let index = this.selectedRecords.indexOf(id);
    if (index > -1){
      this.selectedRecords.splice(index, 1);
    }else{
      this.selectedRecords.push(id);
    }
  }

  toggleAll(){
    if (this.selectAll){
      this.selectedRecords = this.allRecordKeys.slice();
    }else{
      this.selectedRecords = [];
    }
  }

  isSelected(id){
    return  this.selectedRecords.indexOf(id) > -1;
  }
}
