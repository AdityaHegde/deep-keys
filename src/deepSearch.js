define([
  "./notNone",
  "./typeOf",
], function(notNone, typeOf) {

var
getInsertObject = function(nextKey) {
  if(nextKey.match(/^\d+$/)) {
    return [];
  }
  else {
    return {};
  }
},

/**
 * Searches for the value of key. Returns array of matches.
 * Each match has the object at last level, last key and value of the whole key.
 * The key can have "*" to search in all elements of array or all keys in an object.
 *
 * @method deepSearch
 * @for DeepKeysLib
 * @static
 * @param obj {Object|Array} Object/Array to search in.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @param [insert] {Boolean} To insert keys if not present or not. Defaults to false.
 * @param [expandKeys] {Array} Array of key maps for each * of objects in the key to use intead of all keys. Defaults to all.
 * @return {Array} Array of matches. Each match is an array [object at last level, last key, value of the whole key]. Returns null if no matches are found.
 */
deepSearch = function(obj, key, insert, expandKeys) {
  var keys = key.split(/\./), i = 0;
  for(i = 0; i < keys.length - 1; i++) {
    if(keys[i] === "*") {
      var
      results = [];
      if(typeOf(obj) === "array" || typeOf(obj) === "object") {
        var searchObj = obj;
        if(typeOf(obj) === "object" && expandKeys && expandKeys.length > 0) {
          searchObj = expandKeys[0];
          expandKeys = expandKeys.splice(1);
        }
        for(var k in searchObj) {
          if(obj[k] !== null && obj[k] !== undefined) {
            var retResults = deepSearch(obj[k], keys.slice(i + 1).join("."), insert, expandKeys);
            if(retResults) {
              Array.prototype.push.apply(results, retResults);
            }
          }
        }
      }
      return results.length > 0 ? results : null;
    }
    else if(notNone(obj[keys[i]])) {
      obj = obj[keys[i]];
    }
    else if(insert) {
      obj[keys[i]] = getInsertObject(keys[i + 1]);
      obj = obj[keys[i]]
    }
    else {
      return null;
    }
  }
  if(keys[i] !== "") {
    //return match only if
    //last obj is array and last key is index
    //or last obj is object
    //and last key is not *
    if(((typeOf(obj) === "array" && keys[i].match(/^\d*$/)) || typeOf(obj) === "object") && keys[i] !== "*") {
      return [[obj, keys[i], obj[keys[i]]]];
    }
    else {
      return null;
    }
  }
  else {
    return [[obj, keys[i], obj]];
  }
};

return deepSearch;

});
