export class TimeHelper{
  timeElapsed: number = 0;

  hours: any;
  minutes: any;
  seconds: any;
  milliseconds: any;

  constructor(){

  }

  formatTime(milliseconds){
    this.hours = "00"
    this.minutes = "00";
    this.seconds = "00";
    this.milliseconds = "00";

    if (milliseconds){
      this.hours = Math.floor(milliseconds/3600000).toString();
      this.minutes = Math.floor(milliseconds%3600000/60000).toString();
      this.seconds = Math.floor(milliseconds%60000/1000).toString();
      this.milliseconds = Math.floor((milliseconds%1000)/10).toString();

      this.prependZeros();
    }

    return this.hours + ":" + this.minutes + ":" + this.seconds// + ":" + this.milliseconds;
  }

  prependZeros(){
    this.hours = this.prependZero(this.hours, 2);
    this.minutes = this.prependZero(this.minutes, 2);
    this.seconds = this.prependZero(this.seconds, 2);
    this.milliseconds = this.prependZero(this.milliseconds, 2);
  }

  prependZero(it, totalDigits){
    if (it.length === totalDigits){
      return it;
    }else if (it.length <= totalDigits){
      return this.prependZero("0" + it, totalDigits);
    }
  }

}
