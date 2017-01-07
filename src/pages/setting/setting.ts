import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { CategoryPage } from '../category/category'

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  constructor(public navCtrl: NavController) {

  }

  navigateToCategory(){
    this.navCtrl.push(CategoryPage)
  }

}
