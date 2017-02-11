import moment from 'moment';

export class TimeHelper{
  constructor(){

  }

  justDate(milliseconds){
    return moment(milliseconds).millisecond(0).second(0).minute(0).hour(0).valueOf();
  }

  convertISOStringToLocalMilliseconds(str){
    return new Date(moment(str).format('MM/DD/YYYY')).getTime();
  }
}
