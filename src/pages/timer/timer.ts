import { AdsHelper} from '../helper/ads';
import { Component, ViewChild  } from '@angular/core';
import { Constant } from '../helper/constant'
import { NavController, Slides, Platform } from 'ionic-angular';
import { Pouch } from  '../helper/pouch';
import { StatusBar, Keyboard, GoogleAnalytics, Splashscreen } from 'ionic-native';


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
  isEmpty: boolean = true;

  width: any;
  greenButtonText: string = "";
  redButtonText: string = "";

  startCategory: string = "";
  currentCategory: string = "";
  newTitle: String = "";
  setNewTitle: boolean = false;

  tip1: string = "";
  tip2: string = "";

  isLoading: boolean = false;

  constructor(
    private ads: AdsHelper,
    private constant: Constant,
    private nav: NavController,
    private pouch: Pouch,
    private platform: Platform
  ) {
    platform.ready().then(() => {
      GoogleAnalytics.startTrackerWithId(this.constant.ANALYTICS_ID)
        .then(() => {
          console.log('Google analytics is ready now');
          // Tracker is ready
          // You can now track pages or set additional information such as AppVersion or UserId
          GoogleAnalytics.setAppVersion(this.constant.APP_VERSION);
          GoogleAnalytics.setAllowIDFACollection(true);
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
    });

    this.setupDefault();
    Keyboard.disableScroll(true);
  }

  ionViewWillEnter() {
    GoogleAnalytics.trackView('Timer', '', false);
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
    GoogleAnalytics.trackEvent('Timer', 'Start', 'Start label', 1, false);

    if (this.timeElapsed === 0){
      this.startCategory = this.currentCategory;
    }
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
    StatusBar.backgroundColorByHexString("#1fc21b");
  }

  pause(){
    GoogleAnalytics.trackEvent('Timer', 'Pause', 'Pause label', 1, false);

    this.isPaused = true;
    this.isCounting = false;
    clearInterval(this.interval);

    this.setUpText();
    StatusBar.backgroundColorByHexString("#000000");
  }

  setupDefault(){
    /**
     * set up default category
     * should only happen once during the app lifecycle
     */
    this.pouch.getAllCategory().then((data)=>{

      if (data['total_rows'] == 0){
        let defaultCategory = this.constant.CATEGORY_DEFAULT;
        this.pouch.addCategory(defaultCategory, null);
        this.pouch.setLocal(this.constant.CATEGORY_CURRENT, defaultCategory);
      }else if (!this.pouch.getLocal(this.constant.CATEGORY_CURRENT)){
        this.pouch.setLocal(this.constant.CATEGORY_CURRENT,data['rows'][0].doc.name);
      }

      this.refresh();
    })

    /**
     * safe deletion, it is undefined when never set up
     */
    if (!this.pouch.getLocal('safeDeletion')){
      this.pouch.setLocal('safeDeletion', 'true');
    }

    //flags for calendar
    this.pouch.setLocal("initCalendar", false);
    this.pouch.setLocal("hasNewRecord", false);
  }

  save(slidingItem){
    GoogleAnalytics.trackEvent('Timer', 'Save', 'Save label', 1, false);

    //this flag is used in calendar page to decide refresh or not
    this.pouch.setLocal("hasNewRecord", true);

    this.storeRecords( () => {
      this.clear(slidingItem);
    });
  }

  clear(slidingItem){
    GoogleAnalytics.trackEvent('Timer', 'Clear', 'Clear label', 1, false);

    clearInterval(this.interval);

    this.isPaused = false;
    this.isCounting = false;
    this.isStarted = false;
    this.timeElapsed = 0;

    this.isStarted = false;
    this.timeElapsed = 0;

    this.setUpText();
    slidingItem.close();
    StatusBar.backgroundColorByHexString("#000000");

    this.setNewTitle = true;
    this.refresh();
  }

  setUpText(){
    this.greenButtonText = this.isStarted &&  this.isPaused ? 'Resume' : 'Start';
    this.redButtonText = this.isPaused ? 'Stop' : 'Pause';
  }

  storeRecords(callback){
    if (this.currentCategory){
      this.pouch.incrementSeed(this.startCategory, (seed) => {

        let newRecord =  {
          category: this.startCategory,
          duration: this.timeElapsed,
          title: this.newTitle,
          timestamp: this.startTime,
          endTime: new Date().getTime()
        }

        this.pouch.add(newRecord).then((response) => {
          callback();
          this.setNewTitle = true;
          this.refresh();
        });
      })

      this.pouch.incrementSeed(this.constant.CATEGORY_SEED, (seed)=>{
        console.log('seed', seed);
        if (seed % this.constant.ADS_FREQUENCEY === 0){
          this.ads.showInterstitial();
        }
      })
    }
  }

  switchToCategory(cat){
    this.pouch.setLocal(this.constant.CATEGORY_CURRENT, cat);
    this.pouch.setLocal(this.constant.FORCE_QUIT, true);
    this.nav.parent.select(1);
  }

  showMore(){
    this.pouch.setLocal(this.constant.FORCE_QUIT, true);
    this.nav.parent.select(1);
  }

  refresh(){
    this.isLoading = true;

    GoogleAnalytics.trackEvent('Timer', 'Refresh', 'Refresh label', 1, false);
    this.hideSplashScreen();

    let prevCategory = this.currentCategory;
    this.currentCategory = this.pouch.getLocal(this.constant.CATEGORY_CURRENT);

    if (!prevCategory || this.setNewTitle || (!this.isStarted && this.currentCategory !== prevCategory)){
      this.pouch.getSeed(this.currentCategory, (x) => {
        this.newTitle = this.currentCategory + ' ' + x;
        this.setNewTitle = false;
      })
    }

    this.setUpText();
    this.isEmpty = true;
    this.tip1 = '';
    this.tip2 = '';

    this.pouch.getAll().then((docs) =>{
      /**
       * docs.rows is an array list object, thus use keys pipe to loop
       */
      let records = this.pouch.getAsArray(docs);
      if (records.length){
        this.isEmpty = false;
      }else{
        this.tip1 = 'Tap to start or pause';
        this.tip2 = 'Swipe to save or cancel';
      }

      records.sort((a, b) => b['doc'].timestamp -  a['doc'].timestamp);

      if (records.length > this.constant.FIRST_PAGE_RECORDS){
        this.hasMoreRecords = true;
      }else{
        this.hasMoreRecords = false;
      }

      records = records.slice(0, this.constant.FIRST_PAGE_RECORDS);
      this.records = records;

      this.isLoading = false;
    })
  }

  hideSplashScreen() {
    if (Splashscreen) {
      setTimeout(() => {
        Splashscreen.hide();
      }, 100);
    }
  }
}
