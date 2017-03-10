import { LoadingController } from 'ionic-angular';

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
