import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';

@Injectable()
export class Pouch {
  private _db;
  private _categroyDb;

  constructor() {
    this._db = new PouchDB('records', { adapter: 'websql' });
    this._categroyDb = new PouchDB('categories', { adapter: 'websql' });

    window['PouchDB'] = this._db;
    window['PouchCategory'] = this._categroyDb;
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
    this._db.destroy(function (err, response) {
      if (err) {
        return console.log(err);
      } else {
        // success
        console.info('destroyed database, recreate one');

        this._db = new PouchDB('records', { adapter: 'websql' });
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
    this._categroyDb.post({
      name: name
    }).then((docs) =>{
      if (callback) callback();
    })
  }

  deleteCategory(id, callback){
    let self = this;
    console.log('deleting: ', id);

    self._categroyDb.get(id, function(err, doc) {
      if (err) { return console.log(err); }
      console.log('getting', doc);

      self._categroyDb.remove(doc, function(err, response) {
        if (err) { return console.log(err); }
        if (callback) callback();
      });
    });
  }

  updateCategory(newValue, oldValue, oldId, callback){
    if (!newValue || !oldId) return;
    let self = this;

    this.deleteCategory(oldId,  function(err, response) {
      if (err) { return console.log(err); }
      // handle response
      self.addCategory(newValue, callback);
      self.updateRecordsCategory(newValue, oldValue);
    });
  }

  updateRecordsCategory(newValue, oldValue){
    if (!newValue || !oldValue) return;

    this.getAll().then((docs) => {
      let records = this.getAsArray(docs);
      for (let i = 0; i<records.length; i++){
        if (records[i].doc.category === oldValue){
          this._categroyDb.put({
            _id: records[i].id,
            _rev: records[i]._rev,
            category: newValue
          }, function(err, response){
            if (err) { return console.log(err); }
          })
        }
      }
    })
  }
}
