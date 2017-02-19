import { AdsHelper} from '../helper/ads';
import { Component, ViewChild  } from '@angular/core';
import { Constant } from '../helper/constant'
//import { Extra } from '../helper/extra';
import { NavController, Slides } from 'ionic-angular';
import { Pouch } from  '../helper/pouch';


@Component({
  selector: 'page-timer',
  templateUrl: 'timer.html'
})
export class TimerPage {
  @ViewChild(Slides) slides: Slides;

  interval: any = null;
  isCounting: boolean = false;
  isPaused: boolean = false;
  isStarted: boolean = false;
  timeElapsed: number = 0;
  title: string = "";
  startTime: any;

  currentTime: number;
  prevTime: number;
  records: any = {};
  hasMoreRecords: boolean = false;

  width: any;
  greenButtonText: string = "";
  redButtonText: string = "";

  currentCategory: string = "";
  newTitle: String = "";

  constructor(
    private ads: AdsHelper,
    private constant: Constant,
    //private extra: Extra,
    private nav: NavController,
    private pouch: Pouch
  ) {
    this.setupDefaultCategory();
  }

  ionViewWillEnter() {
    this.refresh();
  }

  tap(){
    if (this.isStarted && !this.isPaused){
      this.pause();
    }else{
      this.start();
    }
  }

  start(){
    this.startTime = new Date().getTime();
    this.prevTime = new Date().getTime();
    this.isCounting = true;
    this.isPaused = false;
    this.isCounting = true;
    this.isStarted = true;
    this.interval = setInterval( () => {
      this.currentTime = new Date().getTime();
      this.timeElapsed += (this.currentTime - this.prevTime);
      this.prevTime = this.currentTime;
    }, 500)

    this.setUpText();
  }

  pause(){
    this.isPaused = true;
    this.isCounting = false;
    clearInterval(this.interval);

    this.setUpText();
  }

  setupDefaultCategory(){
    this.pouch.getAllCategory().then((data)=>{
      let defaultCategory = this.constant.CATEGORY_DEFAULT;

      if (data['total_rows'] == 0){
        this.pouch.addCategory(defaultCategory, null);
        this.pouch.setLocal(this.constant.CATEGORY_CURRENT, defaultCategory);
      }
    })
  }

  save(slidingItem){
    this.storeRecords( () => {
      this.clear(slidingItem);
    });
  }

  clear(slidingItem){
    clearInterval(this.interval);

    this.isPaused = false;
    this.isCounting = false;
    this.isStarted = false;
    this.timeElapsed = 0;

    this.isStarted = false;
    this.timeElapsed = 0;

    this.setUpText();
    slidingItem.close();
  }

  setUpText(){
    this.greenButtonText = this.isStarted &&  this.isPaused ? 'Resume' : 'Start';
    this.redButtonText = this.isPaused ? 'Stop' : 'Pause';
  }

  storeRecords(callback){
    if (this.currentCategory){
      this.pouch.incrementSeed(this.currentCategory, (seed) => {

        let newRecord =  {
          category: this.currentCategory || this.constant.CATEGORY_DEFAULT,
          duration: this.timeElapsed,
          title: this.currentCategory + ' ' + seed,
          timestamp: this.startTime
        }

        this.pouch.add(newRecord).then((response) => {
          callback();
          this.refresh();
        });
      })
    }
  }

  switchToCategory(cat){
    this.pouch.setLocal(this.constant.CATEGORY_CURRENT, cat);
    this.nav.parent.select(1);
  }

  showMore(){
    this.nav.parent.select(1);
  }

  refresh(){
    this.currentCategory = this.pouch.getLocal(this.constant.CATEGORY_CURRENT);
    this.pouch.getSeed(this.currentCategory, (x) => {
      this.newTitle = this.currentCategory + ' ' + x;
    })


    this.setUpText();

    console.log('refresh', this.currentCategory);


    this.pouch.getAll().then((docs) =>{
      /**
       * docs.rows is an array list object, thus use keys pipe to loop
       */
      let records = this.pouch.getAsArray(docs);
      records.sort((a, b) => b['doc'].timestamp -  a['doc'].timestamp);

      if (records.length > 10){
        this.hasMoreRecords = true;
      }else{
        this.hasMoreRecords = false;
      }

      records = records.slice(0, 10);
      this.records = records;
    })
  }
}
