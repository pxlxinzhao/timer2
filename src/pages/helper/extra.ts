import {Injectable} from '@angular/core';
import {Platform} from 'ionic-angular/index';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class Extra {

  public getEventObserver: any;
  public getEvent: any;

  constructor(private platform: Platform){
    this.getEventObserver = null;
    this.getEvent = Observable.create(observer => {
      this.getEventObserver = observer;
    });
  }

  //public refresh(callback: any) {
  //  if (this.getEventObserver){
  //    this.getEventObserver.next(callback);
  //  }
  //}

  public refreshRecords(data: any){
    if (this.getEventObserver){
      this.getEventObserver.next(data);
    }
  }



  //public switchToCategory(){
  //  if (this.getEventObserver){
  //    this.getEventObserver.next();
  //  }
  //}

}
