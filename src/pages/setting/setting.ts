import { CategoryPage } from '../category/category'
import { Component } from '@angular/core';
import { Pouch } from  '../helper/pouch';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  constructor(public navCtrl: NavController,
  private pouch: Pouch) {

  }

  navigateToCategory(){
    this.navCtrl.push(CategoryPage)
  }

  reset(){
    this.pouch.reset();
  }

}
