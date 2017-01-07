import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { RecordPage } from '../pages/record/record';
import { SettingPage } from '../pages/setting/setting';
import { TimerPage } from '../pages/timer/timer';
import { TabsPage } from '../pages/tabs/tabs';
import { KeysPipe } from '../pages/pipes/keysPipe';
import { CategoryPage } from '../pages/category/category';
import { DatePipe } from '../pages/pipes/DatePipe';
import { DbHelper } from '../pages/helper/db';
import { Constant } from  '../pages/helper/constant';
import { Extra } from '../pages/helper/extra';
import { TimeHelper } from '../pages/helper/time';
import { CategoryPopover} from '../pages/about/category-popover'

@NgModule({
  declarations: [
    MyApp,
    RecordPage,
    SettingPage,
    TimerPage,
    TabsPage,
    CategoryPopover,
    KeysPipe,
    DatePipe,
    CategoryPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RecordPage,
    SettingPage,
    TimerPage,
    TabsPage,
    CategoryPopover,
    CategoryPage
  ],
  providers: [
    DbHelper,
    TimeHelper,
    Extra,
    Constant
  ]
})
export class AppModule {}
