import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Helper } from '../helper/helper';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  categories:string[] = [];
  records:any = {};
  helper:Helper;

  constructor(public navCtrl:NavController, helper:Helper) {
    this.helper = helper;

    if (!window.localStorage['categories']) {
      window.localStorage['categories'] = JSON.stringify(['Default']);
    }
    this.categories = JSON.parse(window.localStorage['categories']);

    this.refresh();
  }

  addRecord(name:string, record:string) {
    if (this.records[name]) {
      console.info('Record ' + name + ' already exists');
    } else {
      this.records[name] = record;
    }
  }

  ionViewWillEnter() {
    this.refresh();
  }

  deleteRecord(id) {
    this.helper.delete('records', id);
    this.refresh();
  }

  refresh(){
    if (window.localStorage['records']) {
      this.records = JSON.parse(window.localStorage['records']);
    }
  }
}