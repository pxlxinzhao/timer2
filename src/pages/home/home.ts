import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { DbHelper } from '../helper/db';
import { TimeHelper} from '../helper/time';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  timeHelper: TimeHelper;
  dbHelper: DbHelper;

  interval: any = null;
  timeCounter: string = "00:00:00:000";

  title: string = "";
  timeElapsed: number = 0;
  isCounting: boolean = false;
  isPaused: boolean = false;
  isStarted: boolean = false;

  records: any = {};
  currentTime: number;
  prevTime: number;

  width: any;

  constructor(
    navCtrl: NavController,
    timeHelper: TimeHelper,
    dbHelper: DbHelper
  ) {
    this.timeHelper = timeHelper;
    this.dbHelper = dbHelper;
    this.setupDefault();
    this.refresh();
  }

  ionViewWillEnter() {
    this.refresh();
  }

  ionViewDidEnter() {
    let container = document.getElementsByClassName("main-timer-container")[0];
    this.width = container['offsetWidth'] + 'px';
    //console.log('container', container, container['offsetWidth']);
  }

  formatDuration(milli){
    return this.timeHelper.formatTime(milli);
  }

  start(){
    this.prevTime = new Date().getTime();

    this.isPaused = false;
    this.isCounting = true;
    this.isStarted = true;
    let self = this;
    this.interval = setInterval(function () {
      self.currentTime = new Date().getTime();
      self.timeElapsed += (self.currentTime - self.prevTime);
      self.prevTime = self.currentTime;
      self.updateTimeCounter();
    }, 67)
  }

  pause(){
    this.isPaused = true;
    this.isCounting = false;
    clearInterval(this.interval);
  }

  resume(){
    this.start();
  }

  setupDefault(){
    if (!window.localStorage['categories']) {
      window.localStorage['categories'] = JSON.stringify(['Default category']);
    }

    if (!window.localStorage['records']){
      window.localStorage['records'] = JSON.stringify({});
    }
  }

  stop(){
    clearInterval(this.interval);
    this.storeRecords();

    this.isPaused = false;
    this.isCounting = false;
    this.isStarted = false;
    this.timeElapsed = 0;

    this.refresh();
  }

  storeRecords(){
    var storedRecords = JSON.parse(window.localStorage['records']);
    storedRecords[new Date().getTime()] = {
      duration: this.timeElapsed,
      title: this.title,
      category: 'Default category'
    }

    window.localStorage['records'] = JSON.stringify(storedRecords);
  }

  updateTimeCounter() {
    this.timeCounter = this.timeHelper.formatTime(this.timeElapsed);
    this.refresh();
  }

  showDialog(){
    let self = this;
    Dialogs.prompt('Enter a title', 'New Record', ['Ok','Cancel'], '')
      .then(function(result) {
        var input = result.input1;
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        var btnIndex = result.buttonIndex;

        if(btnIndex === 1){
          self.title = input;
          self.start();
        }
      });
  }

  refresh(){
      this.records = this.dbHelper.get('records');



      //this.width = container ? container.offsetWidth : '100px';
  }
}
