import { Component } from "@angular/core";
import { Constant } from '../helper/constant'
import { Extra } from '../helper/extra';
import { TimeHelper } from '../helper/time';
import { Pouch } from  '../helper/pouch';
import { NavController } from 'ionic-angular';
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

  displayCategory: any;
  showDetail: boolean = false;

  constructor(private pouch: Pouch,
  private extra: Extra,
  private timeHelper: TimeHelper,
  private constant: Constant,
  private navCtrl: NavController){
    this.refresh();
  }

  ionViewWillEnter() {

    if (this.displayCategory
      && this.displayCategory !== this.pouch.getLocal(this.constant.CATEGORY_CURRENT)){
      this.navCtrl.pop();
      return;
    }

    this.displayCategory = this.pouch.getLocal(this.constant.CATEGORY_CURRENT);

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

    let calendarMap = {};
    //let records = JSON.parse(this.pouch.getLocal("records"));
    this.pouch.getTemp("records", (docs) => {
      let records = docs.value;

      //console.log(12)
      //console.log('records', records);

      /**
       * records are already sorted
       */
      let prevTimestamp = null;

      for (let i=0; i<records.length; i++){
        let record = records[i];
        let dateStr = self.getDate(record);

        if (!calendarMap[dateStr]){

          var dayDiff = 0;
          if (prevTimestamp){
            let from = moment(this.timeHelper.justDate(prevTimestamp));
            let to = moment(this.timeHelper.justDate(record.doc.timestamp));
            dayDiff = from.diff(to, 'days') - 1;//exclusive on both side
          }

          calendarMap[dateStr] = {
            totalTime: record.doc.duration/1,
            count: 1,
            dayDiff: dayDiff
          }
        }else{
          calendarMap[dateStr].totalTime += record.doc.duration/1;
          calendarMap[dateStr].count += 1;
        }

        prevTimestamp = record.doc.timestamp;
      }

      /**
       * find streak
       */
      let streakStartDate;
      let position=0;
      let streak = 0;
      let result = [];

      for (let key in calendarMap){
        if (position == 0){
          streakStartDate = key;
          streak++;
        }else{
          if (calendarMap[key].dayDiff < 1){
            streak++;
          }else{
            result.push({
              streak: streak,
              streakStartDate: streakStartDate
            })
            streakStartDate = key;
            streak = 1;
          }
        }
        position++;
      }

      /**
       * push result when streak breaks or
       * finish looping the calendar map
       */
      result.push({
        streak: streak,
        streakStartDate: streakStartDate
      })

      /**
       * set streak
       */
      for (let i=0; i<result.length; i++){
        let r = result[i];
        calendarMap[r.streakStartDate].streak = r.streak;
      }

      /**
       * calculate threshold for power cell
       */
      let durationArray = [];

      for (let key in calendarMap){
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

  toggleDetail(){
    this.showDetail = !this.showDetail;
  }
}
