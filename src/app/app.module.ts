import { CategoryPage } from '../pages/category/category';
import { CategoryPopover} from '../pages/about/category-popover'
import { Constant } from  '../pages/helper/constant';
import { DatePipe } from '../pages/pipes/DatePipe';
import { DbHelper } from '../pages/helper/db';
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

@NgModule({
  declarations: [
    CategoryPage,
    CategoryPopover,
    DatePipe,
    KeysPipe,
    RecordPage,
    SettingPage,
    TabsPage,
    TimerPage,
    MyApp
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CategoryPage,
    CategoryPopover,
    MyApp,
    RecordPage,
    SettingPage,
    TabsPage,
    TimerPage
  ],
  providers: [
    Constant,
    DbHelper,
    Extra,
    Pouch,
    TimeHelper
  ]
})
export class AppModule {}
