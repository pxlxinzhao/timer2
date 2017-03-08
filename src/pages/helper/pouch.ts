import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';
import { Constant } from '../helper/constant'

@Injectable()
export class Pouch {
  private _db;
  private _categroyDb;

  /**
   * create seed based on activity
   */
  private _seedDb;

  /**
   * This database temporarily sets records
   * for cross page usage
   */
  private _tempDb;


  constructor(private constant: Constant) {
    this._db = new PouchDB('records', { adapter: 'websql' });
    this._categroyDb = new PouchDB('categories', { adapter: 'websql' });
    this._seedDb = new PouchDB('seed', {adapter: 'websql'});
    this._tempDb = new PouchDB('temp', { adapter: 'websql' });

    window['PouchDB'] = this._db;
    window['PouchCategory'] = this._categroyDb;
    window['PouchSeed'] = this._seedDb;;
    window['PouchTemp'] = this._tempDb;
  }

  getDb(){
    return this._db;
  }

  add(record){
    return this._db.post(record);
  }

  update(record) {
    return this._db.put(record);
  }

  delete(record) {
    return this._db.remove(record);
  }

  setLocal(id, value){
    window.localStorage[id] = value;
  }

  getLocal(id){
    return window.localStorage[id];
  }

  incrementSeed(activity, callback){
    this._seedDb.get(activity, (err, doc) => {
      if (err && err.status == 404){
        this._seedDb.put({
          _id: activity,
          seed: 2
        }, function(error, response){
          if (error) return console.error(error);
          callback(1);
        });
      }else{
        this._seedDb.put({
          _id: doc._id,
          _rev: doc._rev,
          seed: doc.seed + 1
        }, function(error, response){
          if (error) return console.error(error);

          console.log(doc.seed, doc);
          callback(doc.seed);
        });
      }
    });
  }

  getSeed(activity, callback){
    console.log('activity', activity);
    if (!activity) return;

    this._seedDb.get(activity, (err, doc) => {
      if (err && err.status == 404){
        this._seedDb.put({
          _id: activity,
          seed: 1
        }, function(error, response){
          if (error) return console.error(error);
          callback(1);
        });
      }else{
        callback(doc.seed);
      }
    });
  }

  setTemp(id,value){
    let self = this;

    this._tempDb.destroy(function (err, response) {
      if (err) {
        return console.log(err);
      } else {
        // success
        self._tempDb = new PouchDB('temp', { adapter: 'websql' });

        self._tempDb.put({
          _id: id,
          value: value
        })
      }
    });
  }

  getTemp(id, callback){
    this._tempDb.get(id, function(err, doc) {
      if (err) { return console.log(err); }
      callback(doc);
    });
  }

  /**
   * @returns promise, call 'then' to use docs
   */
  getAll() {
      return this._db.allDocs({ include_docs: true})
  }

  getAllCategory() {
    return this._categroyDb.allDocs({ include_docs: true})
  }

  reset(){
    let self = this;
    let countdown = 4;

    this.setLocal(this.constant.RECORD_SELECTED_TO_CHANGE_CATEGORY, '');
    this.setLocal(this.constant.CATEGORY_SELECTED, '');
    this.setLocal(this.constant.CATEGORY_CURRENT, '');
    //this.setLocal(this.constant.CATEGORY_SEED, 1);

    this.setLocal("records", '');
    this.setLocal("totalTime", '');
    this.setLocal("totalCount",'');
    this.setLocal('fromDate', '');
    this.setLocal('toDate', '');
    this.setLocal('safeDeletion', '');

    self._db.destroy(function (err, response) {
      if (err) {
        return console.log(err);
      } else {
        console.info('destroyed records database, recreate one');
        self._db = new PouchDB('records', { adapter: 'websql' });
        if (--countdown == 0){
          window.location.reload();
        }
      }
    });
    self._categroyDb.destroy(function (err, response) {
      if (err) {
        return console.log(err);
      } else {
        console.info('destroyed categories database, recreate one');
        self._db = new PouchDB('records', { adapter: 'websql' });
        if (--countdown == 0){
          window.location.reload();
        }
      }
    });
    self._tempDb.destroy(function (err, response) {
      if (err) {
        return console.log(err);
      } else {
        console.info('destroyed temp database, recreate one');
        self._db = new PouchDB('records', { adapter: 'websql' });
        if (--countdown == 0){
          window.location.reload();
        }
      }
    });
    self._seedDb.destroy(function (err, response) {
      if (err) {
        return console.log(err);
      } else {
        console.info('destroyed seed database, recreate one');
        self._db = new PouchDB('records', { adapter: 'websql' });
        if (--countdown == 0){
          window.location.reload();
        }
      }
    });

  }

  getAsArray(docs){
    let rows = docs['rows'];
    let records = [];
    for (var key in rows){
      records.push(rows[key]);
    }
    return records;
  }

  addCategory(name, callback){
    if (!name) return;

    this._categroyDb.post({
      name: name
    }).then((docs) =>{
      if (callback) callback();
    })
  }

  deleteRecord(id, callback){
    let self = this;
    self._db.get(id, function(err, doc) {
      if (err) { return console.log(err); }
      self._db.remove(doc, function(err, response) {
        if (err) { return console.log(err); }
        if (callback) callback();
      });
    });
  }

  deleteCategory(id, callback){
    let self = this;
    self._categroyDb.get(id, function(err, doc) {
      if (err) { return console.log(err); }
      self._categroyDb.remove(doc, function(err, response) {
        if (err) { return console.log(err); }

        self.getAll().then((docs) => {
          let records = self.getAsArray(docs);

          for (let i=0; i<records.length; i++) {
            if (records[i].doc.category === doc.name){
              self.deleteRecord(records[i].doc._id, null);
            }
          }
        })

        if (callback) callback();
      });
    });
  }

  /**
   * change category name in setting page
   */
  updateCategory(id, newValue, callback){
    if (!newValue || !id) return;
    let self = this;

    this._categroyDb.get(id, function(err, doc){
      if (err) return console.log(1, err);

      self._categroyDb.put({
        _id: id,
        _rev: doc._rev,
        name: newValue
      }, function(err, res){
        if (err) return console.log(2, err);
        self.updateRecordsCategory(newValue, doc.name);
        callback();
      })
    })
  }


  /**
   * change all records with old category to new category
   */
  updateRecordsCategory(newValue, oldValue){
    console.log('updateRecordsCategory',newValue,oldValue );
    if (!newValue || !oldValue) return;

    let self = this;

    this.getAll().then((docs) => {
      let records = this.getAsArray(docs);

      for (let i=0; i<records.length; i++){
        if (records[i].doc.category === oldValue){
          self.updateRecordCategory(records[i].id, newValue, null);
        }
      }
    })
  }

  /**
   * update a single record's title
   */
  updateRecordTitle(id, newTitle, callback){
    if (!id || !newTitle) return;
    let self = this;

    self._db.get(id, function(err, doc){
      if (err) {
        console.error(err);
      }else{
        self._db.put({
          _id: doc._id,
          _rev: doc._rev,
          title: newTitle,
          category: doc.category,
          duration: doc.duration,
          timestamp: doc.timestamp
        }, function(err, res){
          if (err) console.log(err);
          if (callback) callback();
        })
      }
    })
  }

  /**
   * change a single record's category
   */
  updateRecordCategory(id, newCategory, callback){
    if (!id || !newCategory) return;
    let self = this;

    self._db.get(id, function(err, doc){
      if (err) {
        console.error(err);
      }else{
        self._db.put({
          _id: doc._id,
          _rev: doc._rev,
          title: doc.title,
          category: newCategory,
          duration: doc.duration,
          timestamp: doc.timestamp
        }, function(err, res){
          if (err) console.log(err);
          if (callback) callback();
        })
      }
    })
  }

}
