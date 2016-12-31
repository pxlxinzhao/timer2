import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
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
    AboutPage,
    ContactPage,
    HomePage,
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
    AboutPage,
    ContactPage,
    HomePage,
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
