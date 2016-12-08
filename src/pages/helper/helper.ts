/**
 * Created by patrickpu on 11/4/2016.
 */

export class Helper {
  constructor(){

  }
  delete(table, id){
    let records = JSON.parse(window.localStorage[table]);

    if (records[id]){
      delete records[id];
    }

    window.localStorage[table] = JSON.stringify(records);
  }

  update(table, id, attr, value){
    let records = JSON.parse(window.localStorage[table]);

    if (records[id]){
      records[id][attr] = value;
    }

    window.localStorage[table] = JSON.stringify(records);
  }

  get(table){
    return JSON.parse(window.localStorage[table]);
  }

  save(table, obj){
    window.localStorage[table] = JSON.stringify(obj);
  }

}
