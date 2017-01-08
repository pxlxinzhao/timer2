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
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-record',
  templateUrl: 'record.html'
})
export class RecordPage {
  categories:string[] = [];
  currentCategory: string = "";
  newCategory: string = "";
  records:any = {};
  titles: any = {};
  categoryNames: any = {};
  selectedCategoryId: any = ""
  categoryCount: any = {}
  totalTime: any;
  isCounting: boolean = false;

  constructor(public navCtrl:NavController,
              private constant: Constant,
              private dbHelper:DbHelper,
              private timeHelper:TimeHelper,
              private pop: PopoverController,
              private pouch: Pouch,
              private extra: Extra,
              private platform: Platform) {

    this.pouch.setDefaultCategory();
    this.extra.getEvent.subscribe( (refresh) => {
      this.refresh();
    } );
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

  formatDuration(milli){
    return this.timeHelper.formatTime(milli);
  }

  presentPopover(key) {
    let popover = this.pop.create(CategoryPopover);
    popover.present();

    this.pouch.setLocal(this.constant.RECORD_SELECTED_TO_CHANGE_CATEGORY, key);
  }

  setTitleId(id){
    this.selectedCategoryId = id;
  }

  refresh(){
    /**
     * set up current category
     * first try to use it from local storage which is passed from the timer page
     * else if not set use default category
     */
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
      records.sort((a, b) => b['doc'].timestamp -  a['doc'].timestamp);

      this.records = records;
      this.calculateTotalTime(records);

      console.log('records', records);
    })
  }

  calculateTotalTime(records){
    let total = 0;
    for (let k in records){
      total += records[k].doc.duration;
    }
    this.totalTime = total;
  }

}
