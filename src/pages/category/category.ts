import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Dialogs } from 'ionic-native';
import { Pouch } from  '../helper/pouch';
import { Constant } from  '../helper/constant';
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
              private constant: Constant,
              private platform:Platform,
              private alertCtrl: AlertController) {
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

  confirmDeletion(id){
    if (this.platform.is('core')){
      this.deleteCategory(id);
      return;
    }

    Dialogs.confirm('Are you sure you want to delete this category and all the records under it?', 'Delete category', ['Ok','Cancel'])
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
        //.error('You can not delete the last records');
      }
    })
  }

  addNewCategory() {
    let alert = this.alertCtrl.create({
      title: 'New Category',
      inputs: [
        {
          name: 'newCategory',
          placeholder: ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            if (data.newCategory){
              this.addCategory(data.newCategory);
            }
          }
        }
      ]
    });
    alert.present();
  }

  changeCategoryName(c) {
    let alert = this.alertCtrl.create({
      title: 'Rename',
      inputs: [
        {
          name: 'newName',
          placeholder: ''
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            if (data.newName){
              //this.addCategory(data.newCategory);
              let id = c.id;
              let oldValue = c.doc.name;
              let newValue = data.newName;

              this.pouch.updateCategory(id, newValue, ()=>{

                if (this.pouch.getLocal(this.constant.CATEGORY_CURRENT) === oldValue){
                  this.pouch.setLocal(this.constant.CATEGORY_CURRENT, newValue);
                }

                this.refresh();
              });
            }
          }
        }
      ]
    });
    alert.present();
  }
}
