import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingHelper{
  loading: any = {};

  constructor(public loadingCtrl: LoadingController){

  }

  show(){
    this.loading = this.loadingCtrl.create({
      //spinner: 'hide',
      content: '',
      duration: 60000
    });

    this.loading.present();
  }

  hide(){
    this.loading.dismiss();
  }
}
