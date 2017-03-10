import { LoadingController } from 'ionic-angular';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingHelper{
  //loading: any = {};

  constructor(public loadingCtrl: LoadingController){
    //let loadingCtrl = new LoadingController();
    //this.loading = this.loadingCtrl.create({
    //  spinner: 'hide',
    //  content: 'Loading Please Wait...'
    //});

  }

  show(){
    //this.loading.present();
  }

  hide(){
    //this.loading.dismiss();
  }
}
