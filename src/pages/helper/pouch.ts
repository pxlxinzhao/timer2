import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';

@Injectable()
export class Pouch {
  private _db;
  //private _records;

  constructor() {
    this._db = new PouchDB('records', { adapter: 'websql' });

    window['PouchDB'] = this._db;
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
}
