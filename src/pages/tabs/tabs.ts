import { Component } from '@angular/core';

import { TimerPage } from '../timer/timer';
import { RecordPage } from '../record/record';
import { SettingPage } from '../setting/setting';

import { Constant } from '../helper/constant'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = TimerPage;
  tab2Root: any = RecordPage;
  tab3Root: any = SettingPage;

  debugMode: boolean = false;

  constructor(private constant: Constant) {
    this.debugMode = this.constant.DEBUG_MODE;
  }
}
