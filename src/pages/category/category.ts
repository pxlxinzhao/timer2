import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'category.html'
})
export class CategoryPage {
  categories: any;
  selectedCategory: any;
  categoryNames: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams){
    this.refresh();
  }

  refresh(){
    this.categories = JSON.parse(window.localStorage['categories']).sort();
  }

  selectCategory(c){
    this.selectedCategory = c;
  }

  changeCategoryName(){
    let self = this;
    let oldValue = this.selectedCategory;
    let newValue = this.categoryNames[oldValue];

    if (newValue){
      //update category and records
      let records = JSON.parse(window.localStorage['records']);
      let categories = JSON.parse(window.localStorage['categories']);

      for (let key in records){
        if (records[key].category === oldValue) records[key].category = newValue;
      }

      for (let i=0; i<categories.length; i++){
        if (categories[i] === oldValue) categories[i] = newValue;
      }

      window.localStorage['records'] = JSON.stringify(records);
      window.localStorage['categories'] = JSON.stringify(categories);

      setTimeout(() => {
        self.refresh();
      }, 1)
    }

    this.selectedCategory = "";
  }

  deleteCategory(c){
    let self = this;

    let records = JSON.parse(window.localStorage['records']);
    let categories = JSON.parse(window.localStorage['categories']);

    for (let key in records){
      if (records[key].category === c) {
        delete records[key];
      }
    }

    let index = categories.indexOf(c);
    if (index > -1){
      categories.splice(index, 1)
    }

    window.localStorage['records'] = JSON.stringify(records);
    window.localStorage['categories'] = JSON.stringify(categories);

    setTimeout(() => {
      self.refresh();
    }, 1)
  }
}

