import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { CategoryPage } from '../category/category'

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(public navCtrl: NavController) {

  }

  navigateToCategory(){
    this.navCtrl.push(CategoryPage)
  }

}
