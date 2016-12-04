import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Dialogs } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  interval: any = null;
  timeCounter: string = "00:00:00";
    //+ ":000";

  hours: any = "00"
  minutes: any = "00";
  seconds: any = "00";
  miniSeconds: any = "000";

  title: string = "";
  timeElapsed: number = 0;
  isCounting: boolean = false;
  isPaused: boolean = false;
  isStarted: boolean = false;

  constructor(public navCtrl: NavController) {

  }

  start(){
    this.isPaused = false;
    this.isCounting = true;
    this.isStarted = true;
    let self = this;
    this.interval = setInterval(function () {
      self.timeElapsed += 1000;;
      self.updateTimeCounter();
    }, 1000)
  }

  pause(){
    this.isPaused = true;
    this.isCounting = false;
    clearInterval(this.interval);
  }

  resume(){
    this.start();
  }

  stop(){
    this.isPaused = false;
    this.isCounting = false;
    clearInterval(this.interval);

    this.isStarted = false;
    this.timeElapsed = 0;
    this.storeRecords();
  }

  storeRecords(){
    if (!window.localStorage['records']){
      window.localStorage['records'] = JSON.stringify({});
    }

    var storedRecords = JSON.parse(window.localStorage['records']);
    storedRecords[new Date().getTime()] = {
      duration: this.timeCounter,
      title: this.title,
      category: 'Default category'
    }

    window.localStorage['records'] = JSON.stringify(storedRecords);
  }

  updateTimeCounter() {
    let t = this.timeElapsed;

    this.hours = Math.floor(t/3600000);
    this.minutes = Math.floor(t%3600000/60000);
    this.seconds = Math.floor(t%60000/1000);
    this.miniSeconds = t%1000;

    this.hours += "";
    this.minutes += "";
    this.seconds += "";
    this.miniSeconds += "";

    this.prependZeros();
    this.timeCounter = this.hours + ":" + this.minutes + ":" + this.seconds
      //+ ":" + this.miniSeconds;
  }

  prependZeros(){
    this.hours = this.makeIt2Digits(this.hours);
    this.minutes = this.makeIt2Digits(this.minutes);
    this.seconds = this.makeIt2Digits(this.seconds);
    this.miniSeconds = this.makeIt3Digits(this.miniSeconds);
  }

  makeIt2Digits(it){
    if (it.length === 1){
      it = "0" + it;
    }
    return it;
  }

  makeIt3Digits(it){
    it = this.makeIt2Digits(it);
    if (it.length === 2){
      it = "0" + it;
    }
    return it;
  }

  showDialog(){
    let self = this;
    console.log('prompt dialog');
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
}
