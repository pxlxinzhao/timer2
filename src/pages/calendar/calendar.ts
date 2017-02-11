import { Component } from "@angular/core";
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

  constructor(private pouch: Pouch){
    let records = JSON.parse(this.pouch.getLocal("records"));

    //console.log("records", records);
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

      //console.log(this.calendarMap);
    }
  }

  getDate(record){
    return moment(record.doc.timestamp/1).format('MMM DD YYYY');
  }

}
