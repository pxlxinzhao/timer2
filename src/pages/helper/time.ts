import moment from 'moment';

export class TimeHelper{
  constructor(){}

  justDate(milliseconds){
    return moment(milliseconds).millisecond(0).second(0).minute(0).hour(0).valueOf();
  }

  convertISO(str){
    //after substring it will not read string as ISO time.
    return new Date(moment(str.substring(0, 10)).format('MM/DD/YYYY')).getTime();
  }
}
