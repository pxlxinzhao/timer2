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

  constructor(
    private ads: AdsHelper,
    private constant: Constant,
    //private extra: Extra,
    private nav: NavController,
    private pouch: Pouch
  ) {
    this.setupDefault();

    if (!this.pouch.getLocal[this.constant.CATEGORY_SEED]){
      this.pouch.setLocal([this.constant.CATEGORY_SEED], 1);
    }
  }

  ionViewWillEnter() {
    this.refresh();
  }

  ionViewDidEnter() {
    let container = document.getElementsByClassName("main-timer-container")[0];
    this.width = container['offsetWidth'] + 'px';
  }

  pauseOrStop(){
    if (this.isPaused){
      this.stop();
    }else{
      this.pause();
    }
  }

  start(){
    this.startTime = new Date().getTime();
    this.prevTime = new Date().getTime();
    this.isCounting = true;
    this.isPaused = false;
    this.isCounting = true;
    this.isStarted = true;
    let self = this;
    this.interval = setInterval(function () {
      self.currentTime = new Date().getTime();
      self.timeElapsed += (self.currentTime - self.prevTime);
      self.prevTime = self.currentTime;
    }, 500)

    this.setUpText();
  }

  pause(){
    this.isPaused = true;
    this.isCounting = false;
    clearInterval(this.interval);

    this.setUpText();
  }

  setupDefault(){
    this.pouch.getAllCategory().then((data)=>{
      if (data['total_rows'] == 0){
        this.pouch.addCategory("Uncategorized", null);
        this.pouch.setLocal(this.constant.CATEGORY_CURRENT, this.constant.CATEGORY_DEFAULT);
      }
    })
  }

  stop(){
    clearInterval(this.interval);
    this.storeRecords();

    this.isPaused = false;
    this.isCounting = false;
    this.isStarted = false;
    this.timeElapsed = 0;

    this.isStarted = false;
    this.timeElapsed = 0;

    this.setUpText();
  }

  setUpText(){
    this.greenButtonText = this.isStarted &&  this.isPaused ? 'Resume' : 'Start';
    this.redButtonText = this.isPaused ? 'Stop' : 'Pause';
  }

  storeRecords(){
    let seed = parseInt(this.pouch.getLocal([this.constant.CATEGORY_SEED]));
    let currentCategory = this.pouch.getLocal(this.constant.CATEGORY_CURRENT);

    let newRecord =  {
      category: currentCategory || this.constant.CATEGORY_DEFAULT,
      duration: this.timeElapsed,
      title: currentCategory + ' ' + seed,
      timestamp: this.startTime
    }

    this.startTime = 0;

    this.pouch.setLocal(this.constant.CATEGORY_SEED, ++seed);

    this.pouch.add(newRecord).then((response) => {
      this.refresh();
    });

    if ( (seed-1) % 5 === 0){
      this.ads.showInterstitial();
    }
  }

  switchToCategory(cat){
    /**
     * recent record is used to change category of the about page
     */
    this.pouch.setLocal(this.constant.CATEGORY_SELECTED, cat);

    this.nav.parent.select(1);
  }

  showMore(){
    this.nav.parent.select(1);
  }

  refresh(){
    this.setUpText();

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
