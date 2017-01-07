import { Injectable } from '@angular/core';
import * as PouchDB from 'pouchdb';

@Injectable()
export class Pouch {
  private _db;
  private _records;

  constructor() {
    this._db = new PouchDB('records', { adapter: 'websql' });
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

  /**
   * @returns promise, call 'then' to use docs
   */
  getAll() {
      return this._db.allDocs({ include_docs: true})
  }
}
