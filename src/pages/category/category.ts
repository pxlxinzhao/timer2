import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { Pouch } from  '../helper/pouch';
import { Platform } from 'ionic-angular';


@Component({
  templateUrl: 'category.html'
})
export class CategoryPage {
  categories:any;
  categoryNames:any = {};
  isAdding:boolean = false;
  newCategory:string = "";

  constructor(public navCtrl:NavController,
              public navParams:NavParams,
              private pouch: Pouch,
              private platform:Platform) {
    this.refresh();
  }

  refresh() {
    this.pouch.getAllCategory().then((docs) => {
      this.categories = this.pouch.getAsArray(docs).sort();
    })
  }

  showCategoryDialog(){
    if (this.platform.is('core')){
      console.info('can only add record in real device');
      return;
    }

    let self = this;
    Dialogs.prompt('', 'New category', ['Ok','Cancel'], '')
      .then(function(result) {
        let input = result.input1;
        // no button = 0, 'OK' = 1, 'Cancel' = 2
        let btnIndex = result.buttonIndex;

        if(btnIndex === 1){
          self.addCategory(input);
          self.refresh();
        }
      });
  }

  addCategory(input) {

    if (!input) return;

    this.pouch.addCategory(input, null);
    this.refresh();
  }

  changeCategoryName(oldValue, oldId) {
    if (!oldValue || !oldId) return;
    let newValue = this.categoryNames[oldId];

    this.pouch.updateCategory(newValue, oldValue, oldId, ()=>{
      this.refresh();
    });
  }

  confirmDeletion(id){
    Dialogs.confirm('Are you sure you want to delete this category?', 'Delete category', ['Ok','Cancel'])
      .then((result) => {
        //ok is 1, cancel is 2
        if (result === 1){
          this.deleteCategory(id);
        }
      })
  }

  deleteCategory(id) {
    this.pouch.getAllCategory().then((docs)=>{
      let categories = this.pouch.getAsArray(docs);
      if (categories.length > 1){
        this.pouch.deleteCategory(id, () => {
          this.refresh();
        });
      }else{
        console.error('You can not delete the last records');
      }
    })
  }
}
