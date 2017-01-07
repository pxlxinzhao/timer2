import { Component } from '@angular/core';

import { TimerPage } from '../timer/timer';
import { RecordPage } from '../record/record';
import { SettingPage } from '../setting/setting';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TimerPage;
  tab2Root: any = RecordPage;
  tab3Root: any = SettingPage;

  constructor() {

  }
}
