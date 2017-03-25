import { CalendarPage } from '../calendar/calendar'
import { CategoryPage } from '../category/category'
import { Component} from '@angular/core';
import { Constant } from '../helper/constant'
import { Extra } from '../helper/extra';
import { NavController, AlertController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { Pouch } from  '../helper/pouch';
import { TimeHelper} from '../helper/time';
import { Platform } from 'ionic-angular';
import {RecordFilter} from './recordFilter'
import { LoadingHelper } from '../helper/loading'
import { GoogleAnalytics } from 'ionic-native';

import moment from 'moment';
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
  cache: any = [];
  perPage: number = 20;
  curPage: number = 0;
  inifinite: any;
  isReady: boolean = true;
  noLoading: boolean = false;

  constructor(public navCtrl:NavController,
              private constant: Constant,
              private timeHelper:TimeHelper,
              private pop: PopoverController,
              private pouch: Pouch,
              private extra: Extra,
              private platform: Platform,
              private alertCtrl: AlertController,
              private loading: LoadingHelper) {

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

      this.noLoading = true;
      this.refresh();
    })
  }

  ionViewWillEnter() {
    GoogleAnalytics.trackView('Record', '', false);
    this.pouch.setLocal(this.constant.FORCE_QUIT, false);
    this.refresh();
  }

  changeTitle(id, value){
    if (!value) return;

    GoogleAnalytics.trackEvent('Record', 'Change Title', 'Change Title label', 1, false);

    let self = this;

    self.pouch.updateRecordTitle(id, value, function(){
      self.refresh();
    })
  }

  openTitleDialog($event, id, title){
    $event.stopPropagation();

    let alert = this.alertCtrl.create({
      title: 'Rename',
      inputs: [
        {
          name: 'newName',
          value: title,
          placeholder: title
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            if (data.newName) {
              this.changeTitle(id, data.newName);
              this.refresh();
            }
          }
        }
      ]
    });
    alert.present();
  }

  confirmDelete() {
    let alert = this.alertCtrl.create({
      title:  'Delete Record' + (this.selectedRecords.length > 1 ? 's' : ''),
      message: 'Are you sure you want to delete ' +this.selectedRecords.length
      + ' record' + (this.selectedRecords.length > 1 ? 's' : '') + '?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            //console.log('Buy clicked');
            this.deleteRecord();
          }
        }
      ]
    });
    alert.present();
  }

  deleteRecord() {
    GoogleAnalytics.trackEvent('Record', 'Delete Records', 'Delete Records label', 1, false);

    this.loading.show();
    let count = this.selectedRecords.length;
    let size = this.selectedRecords.length;
    let node = document.getElementsByClassName("loading-wrapper")[0];

    for (let i=0; i<this.selectedRecords.length; i++){
      let id = this.selectedRecords[i];

      this.pouch.deleteRecord(id,()=>{
        if (--count === 0){
          this.loading.hide();
          this.refresh();
        }
        node.textContent = (size - count) + '/' + size;
      })
    }
  }

  changeRecordsCategory(){
    if (!this.newCategory || this.newCategory == this.currentCategory) return;
    GoogleAnalytics.trackEvent('Record', 'Change Category', 'Change Category label', 1, false);

    this.loading.show();

    let count = this.selectedRecords.length;
    let size = this.selectedRecords.length;
    let node = document.getElementsByClassName("loading-wrapper")[0];

    for (let i=0; i<this.selectedRecords.length; i++){
      let id = this.selectedRecords[i];
      this.pouch.updateRecordCategory(id, this.newCategory, ()=>{
        if (--count === 0){
          this.selectedRecords = [];
          this.loading.hide();
          this.refresh();
        }
        node.textContent = (size - count) + '/' + size;
      })
    }
  }

  setTitleId(id){
    this.selectedCategoryId = id;
  }

  refresh(){
    if (!this.noLoading){
      this.loading.show();
    }

    this.isReady = false;
    GoogleAnalytics.trackEvent('Record', 'Refresh', 'Refresh label', 1, false);

    let self = this;
    this.isFiltered = false;
    //this.selectAll = false;
    this.newCategory = "";
    this.selectedRecords = [];

    if (this.selectAll){
      this.toggleAll();
    }

    //reset pagination
    if (this.inifinite){
      this.inifinite.enable(true);
    }

    this.curPage = this.perPage;
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

          return (!self.fromDate || self.timeHelper.justDate(time) >= self.timeHelper.convertISO(self.fromDate))
            && (!self.toDate || self.timeHelper.justDate(time)<= self.timeHelper.convertISO(self.toDate));
        })
      }
      /**
       * cache records to be used in the calendar page
       */
      //console.log('for calendar', records.length);

      var temp = [];
      //copay records by value
      this.pouch.setTemp("records", temp.concat(records), ()=>{

        /**
         * this is used for calendar page, to refresh record page first and then refresh calendar page itself
         */
        if (this.refreshCallback){
          this.refreshCallback();
          this.refreshCallback = null;
        }
      });

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
      this.calculateTotal(records);

      this.cache = records;
      this.records = this.cache.splice(0, this.curPage);

      if (!this.noLoading) {
        this.loading.hide();
      }
      this.isReady = true;

      /**
       * set value to the 'change category' select
       */
      for (let i=0; i<records.length; i++){
        this.categoryByRecordIdMap[records[i].id] = records[i].doc.category;
      }

      this.noLoading = false;

    })
  }

  changeCurrentCategory(){
    this.pouch.setLocal(this.constant.CATEGORY_CURRENT, this.currentCategory);
    this.refresh();
  }

  calculateTotal(records){
    let totalTime = 0;

    for (let k in records){
      let duration = records[k].doc.duration;
      totalTime += duration;
    }

    this.totalTime = totalTime;
    this.totalCount = records.length;
  }

  presentPopover(myEvent) {
    let popover = this.pop.create(RecordFilter);
    popover.present({
      ev: myEvent
    })
  }

  switchToCalendar(){
    if (!this.isReady) return;

    this.pouch.setLocal("initCalendar", true);
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
    if (!this.isReady) return;

    if (this.selectAll){
      this.selectAll = false;
      this.selectedRecords = [];

    }else{
      this.selectAll = true;
      this.selectedRecords = this.allRecordKeys.slice();

    }
  }

  isSelected(id){
    return  this.selectedRecords.indexOf(id) > -1;
  }

  displayTime(record){
    return moment(record.doc.timestamp).format('HH:mm');
  }

  loadMore(infiniteScroll) {
    if (!this.inifinite) {
      this.inifinite = infiniteScroll;
    }

    if (this.cache.length <= 0) {
      infiniteScroll.enable(false);
      return;
    }

    setTimeout(() => {
      this.curPage = this.curPage + this.perPage;
      this.records = this.records.concat(this.cache.splice(0, this.curPage));

      infiniteScroll.complete();


      if (this.cache.length <= 0) {
        infiniteScroll.enable(false);
        return;
      }
    }, 0);
  }
}
