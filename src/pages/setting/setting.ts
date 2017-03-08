import { AdsHelper} from '../helper/ads';
import { CategoryPage } from '../category/category'
import { TipPage } from '../tips/tip'
import { Component } from '@angular/core';
import { Pouch } from  '../helper/pouch';
import { NavController } from 'ionic-angular';
import { Toast } from 'ionic-native';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

  safeDeletion: boolean = true;

  constructor(
    private ads: AdsHelper,
    public navCtrl: NavController,
    private pouch: Pouch,
    private platform: Platform
  ) {
    this.safeDeletion = this.pouch.getLocal('safeDeletion') !== 'false';
  }

  navigateToCategory(){
    this.navCtrl.push(CategoryPage)
  }

  navigateToTips(){
    this.navCtrl.push(TipPage)
  }

  reset(){
    this.pouch.reset();
  }

  showToast(){
    Toast.show("I'm a toast", '5000', 'center');
  }

  toggleSafeDeletion(){
    //console.log('safeDeletion', this.safeDeletion);
    this.pouch.setLocal('safeDeletion', this.safeDeletion);
  }

  importTestData(){
    this.pouch.addCategory('Test1', null);
    this.pouch.addCategory('Test2', null);

    let newRecords = [{
      category: 'Test1',
      duration: 20000,
      title: 'Test1 1',
      timestamp: new Date('2017-03-01').getTime()
    },{
      category: 'Test1',
      duration: 30000,
      title: 'Test1 2',
      timestamp: new Date('2017-03-01').getTime()
    },{
      category: 'Test1',
      duration: 40000,
      title: 'Test1 3',
      timestamp: new Date('2017-03-01').getTime()
    },{
      category: 'Test1',
      duration: 20000,
      title: 'Test1 4',
      timestamp: new Date('2017-03-02').getTime()
    },{
      category: 'Test1',
      duration: 30000,
      title: 'Test1 5',
      timestamp: new Date('2017-03-02').getTime()
    },{
      category: 'Test1',
      duration: 40000,
      title: 'Test1 6',
      timestamp: new Date('2017-03-03').getTime()
    },{
      category: 'Test1',
      duration: 40000,
      title: 'Test1 7',
      timestamp: new Date('2017-03-03').getTime()
    },{
      category: 'Test1',
      duration: 20000,
      title: 'Test1 8',
      timestamp: new Date('2017-03-07').getTime()
    },{
      category: 'Test1',
      duration: 30000,
      title: 'Test1 9',
      timestamp: new Date('2017-03-07').getTime()
    },{
      category: 'Test1',
      duration: 40000,
      title: 'Test1 10',
      timestamp: new Date('2017-03-07 23:59:59').getTime()
    },{
      category: 'Test2',
      duration: 40000,
      title: 'Test2 1',
      timestamp: new Date('2017-03-03').getTime()
    },{
      category: 'Test2',
      duration: 20000,
      title: 'Test2 2',
      timestamp: new Date('2017-03-07').getTime()
    },{
      category: 'Test2',
      duration: 30000,
      title: 'Test2 3',
      timestamp: new Date('2017-03-07').getTime()
    },{
      category: 'Test2',
      duration: 40000,
      title: 'Test2 4',
      timestamp: new Date('2017-03-07 23:59:59').getTime()
    }
    ]

    for (let i=0; i<newRecords.length; i++){
      this.pouch.add(newRecords[i]);
    }
  }

}
