export class Constant{
  DEBUG_MODE = true;
  APP_VERSION = 'beta 0.1';

  ADS_FREQUENCEY = 100;
  ANALYTICS_ID = 'UA-93476395-1';

  CATEGORY_SEED: string = "category_seed";
  CATEGORY_SELECTED: string = "category_selected";
  CATEGORY_DEFAULT = "New Record";
  CATEGORY_CURRENT = "currentCategory";

  FORCE_QUIT = "force_quit";

  TAB_TIMER: number = 0;
  TAB_RECORD: number = 1;
  TAB_SETTING: number = 2;

  //RECORD_SELECTED_TO_CHANGE_CATEGORY = "record_selected_to_change_category";

  constructor(){
    if (!this.DEBUG_MODE){
      this.ADS_FREQUENCEY = 10;
    }
  }
}
