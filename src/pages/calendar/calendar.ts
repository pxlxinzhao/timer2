import { Component } from "@angular/core";
import { Extra } from '../helper/extra';
import { Pouch } from  '../helper/pouch';
import moment from 'moment';

@Component({
  templateUrl: 'calendar.html'
})
export class CalendarPage {

  records: any;
  /**
   * key is the date
   * value is
   * {
   *  totalTime,
   *  count
   * }
   */
  calendarMap: Object = {};

  /**
   * 4 power cell only have 3 levels
   */
  level1: any;
  level2: any;
  level3: any;

  constructor(private pouch: Pouch,
  private extra: Extra){
    this.refresh();
  }

  ionViewWillEnter() {
    let self = this;

    this.extra.refreshRecords({
      callback:function(){
        self.refresh();
      }
    })
  }

  getDate(record){
    return moment(record.doc.timestamp/1).format('MMM DD YYYY');
  }

  getLevel(duration){
    let result = duration >= this.level3 ? 3 : duration >= this.level2 ? 2 : duration >= this.level1 ? 1 : 0;
    return result;
  }

  refresh(){
    this.calendarMap = {};
    let records = JSON.parse(this.pouch.getLocal("records"));

    /**
     * records are already sorted
     */
    for (let i=0; i<records.length; i++){
      let record = records[i];
      let dateStr = this.getDate(record);

      if (!this.calendarMap[dateStr]){
        this.calendarMap[dateStr] = {
          totalTime: record.doc.duration/1,
          count: 1
        }
      }else{
        this.calendarMap[dateStr].totalTime += record.doc.duration/1;
        this.calendarMap[dateStr].count += 1;
      }
    }

    /**
     * calculate threshold for power cell
     */
    let durationArray = [];

    for (let key in this.calendarMap){
      durationArray.push(this.calendarMap[key].totalTime);
    }

    durationArray.sort((a, b)=>{return a-b});
    console.log('durationArray', durationArray);
    let length = durationArray.length;

    let threshold1 = Math.floor(length/4);
    let threshold2 = Math.floor(length/4 * 2);
    let threshold3 = Math.floor(length/4 * 3);;

    this.level1 = durationArray[threshold1];
    this.level2 = durationArray[threshold2];
    this.level3 = durationArray[threshold3];

    //console.log('this.level1', this.level1);
    //console.log('this.level2', this.level2);
    //console.log('this.level3', this.level3);
  }
}
