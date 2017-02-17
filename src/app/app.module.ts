import { AdsHelper } from '../pages/helper/ads';
import { CategoryPage } from '../pages/category/category';
import { CalendarPage } from '../pages/calendar/calendar'
import { RecordFilter} from '../pages/record/recordFilter'
import { Constant } from  '../pages/helper/constant';
import { DatePipe } from '../pages/pipes/DatePipe';
import { DbHelper } from '../pages/helper/db';
import { DurationPipe } from '../pages/pipes/DurationPipe';
import { Extra } from '../pages/helper/extra';
import { IonicApp, IonicModule } from 'ionic-angular';
import { KeysPipe } from '../pages/pipes/keysPipe';
import { MyApp } from './app.component';
import { NgModule } from '@angular/core';
import { Pouch } from '../pages/helper/pouch'
import { RecordPage } from '../pages/record/record';
import { SettingPage } from '../pages/setting/setting';
import { TabsPage } from '../pages/tabs/tabs';
import { TimeHelper } from '../pages/helper/time';
import { TimerPage } from '../pages/timer/timer';
import { TipPage } from '../pages/tips/tip';

@NgModule({
  declarations: [
    CategoryPage,
    CalendarPage,
    RecordFilter,
    DatePipe,
    KeysPipe,
    DurationPipe,
    RecordPage,
    SettingPage,
    TabsPage,
    TimerPage,
    TipPage,
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CategoryPage,
    CalendarPage,
    RecordFilter,
    MyApp,
    RecordPage,
    SettingPage,
    TabsPage,
    TimerPage,
    TipPage
  ],
  providers: [
    AdsHelper,
    Constant,
    DbHelper,
    Extra,
    Pouch,
    TimeHelper
  ]
})
export class AppModule {}
