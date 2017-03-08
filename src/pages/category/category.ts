import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
//import { Dialogs } from 'ionic-native';
import { Pouch } from  '../helper/pouch';
import { Constant } from  '../helper/constant';
import { Platform } from 'ionic-angular';


@Component({
  templateUrl: 'category.html'
})
export class CategoryPage {
  categories:any;
  categoryNames:any = [];
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

  ionViewWillEnter() {
    if (this.pouch.getLocal(this.constant.FORCE_QUIT) === 'true'){
      this.navCtrl.pop();
      return;
    }
  }

  refresh() {
    this.pouch.getAllCategory().then((docs) => {
      this.categories = this.pouch.getAsArray(docs).sort((a,b)=>{return a['doc'].name.localeCompare(b['doc'].name)});
      this.categoryNames = [];

      for (let i=0; i<this.categories.length; i++){
        this.categoryNames.push(this.categories[i].doc.name);
      }

      /**
       * if current category get deleted,
       * then use the first category as current
       * @type {*}
       */
      let current = this.pouch.getLocal(this.constant.CATEGORY_CURRENT);
      //console.log(1, current, this.categoryNames);
      if (this.categoryNames.indexOf(current) === -1){
        //console.log('setting current category', this.categoryNames[0]);
        this.pouch.setLocal(this.constant.CATEGORY_CURRENT, this.categoryNames[0]);
      }
    })
  }

  //showCategoryDialog(){
  //  if (this.platform.is('core')){
  //    console.info('can only add record in real device');
  //    return;
  //  }
  //
  //  let self = this;
  //  Dialogs.prompt('', 'New category', ['Ok','Cancel'], '')
  //    .then(function(result) {
  //      let input = result.input1;
  //      // no button = 0, 'OK' = 1, 'Cancel' = 2
  //      let btnIndex = result.buttonIndex;
  //
  //      if(btnIndex === 1){
  //        self.addCategory(input);
  //        self.refresh();
  //      }
  //    });
  //}

  addCategory(input) {

    if (!input) return;

    this.pouch.addCategory(input, null);
    this.refresh();
  }

  confirmDeletion(id){
    let alert = this.alertCtrl.create({
      title:  'Delete Category',
      message: 'Are you sure you want to delete this category and all the records under it?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteCategory(id);
          }
        }
      ]
    });
    alert.present();
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
          placeholder:  c.doc.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'OK',
          handler: data => {
            if (data.newName && data.newName !== c.doc.name){
              let id = c.id;
              let oldValue = c.doc.name;
              let newValue = data.newName;

              for (let i=0; i<this.categories.length; i++){
                if (newValue === this.categories[i].doc.name){
                  console.log('duplicated category', newValue, this.categories[i].doc.name);

                  let alert = this.alertCtrl.create({
                    title: '',
                    subTitle: newValue + ' already exists',
                    buttons: ['OK']
                  });
                  alert.present();

                  return;
                }
              }

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
