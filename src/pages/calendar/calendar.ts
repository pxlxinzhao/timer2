import { Component, ChangeDetectorRef } from "@angular/core";
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
  private extra: Extra,
  private chRef: ChangeDetectorRef){
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
    return moment(record.doc.timestamp/1).format('ddd MMM DD YYYY');
  }

  getLevel(duration){
    let result = duration >= this.level3 ? 3 : duration >= this.level2 ? 2 : duration >= this.level1 ? 1 : 0;
    return result;
  }

  refresh(){
    let self = this;

    console.log(11);

    let calendarMap = {};
    //let records = JSON.parse(this.pouch.getLocal("records"));
    this.pouch.getTemp("records", (docs) => {
      let records = docs.value;

      console.log(12)
      console.log('records', records);

      /**
       * records are already sorted
       */
      for (let i=0; i<records.length; i++){
        let record = records[i];
        let dateStr = self.getDate(record);

        if (!calendarMap[dateStr]){
          calendarMap[dateStr] = {
            totalTime: record.doc.duration/1,
            count: 1
          }
        }else{
          calendarMap[dateStr].totalTime += record.doc.duration/1;
          calendarMap[dateStr].count += 1;
        }
      }

      /**
       * calculate threshold for power cell
       */
      let durationArray = [];

      for (let key in self.calendarMap){
        durationArray.push(calendarMap[key].totalTime);
      }

      durationArray.sort((a, b)=>{return a-b});
      let length = durationArray.length;

      let threshold1 = Math.floor(length/4);
      let threshold2 = Math.floor(length/4 * 2);
      let threshold3 = Math.floor(length/4 * 3);;

      self.level1 = durationArray[threshold1];
      self.level2 = durationArray[threshold2];
      self.level3 = durationArray[threshold3];

      self.calendarMap = calendarMap;
    });
  }
}
