import { CategoryPage } from '../category/category'
import { Component } from '@angular/core';
import { Pouch } from  '../helper/pouch';
import { NavController } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  constructor(public navCtrl: NavController,
  private pouch: Pouch,
  private platform: Platform) {

  }

  navigateToCategory(){
    this.navCtrl.push(CategoryPage)
  }

  reset(){
    this.pouch.reset();
  }

  confirmReset(){
    if (this.platform.is('core')){
      this.reset();
    }else{
      let self = this;

      Dialogs.confirm('Are you sure you want to delete all the records?', 'Reset', ['Ok','Cancel'])
        .then(function(result){
          //ok is 1, cancel is 2
          if (result === 1){
            self.reset();
          }
        })
    }
  }

}
