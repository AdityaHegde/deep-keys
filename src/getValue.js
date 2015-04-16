define([
  "./deepSearch",
  "./notNone",
], function(deepSearch, notNone) {

/**
 * Get values at a deep key. Returns all values as per key.
 *
 * @method getValue
 * @for DeepKeysLib
 * @static
 * @param obj {Object/Array} Object/array to fetch values from.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @param [expandKeys] {Array} Array of key maps for each * of objects in the key to use intead of all keys. Defaults to all.
 * @return {Array} Array of values at "key". Returns null if no values are present.
 */
return function(obj, key, expandKeys) {
  var
  deep = deepSearch(obj, key, false, expandKeys),
  values = [];
  if(deep) {
    for(var i = 0; i < deep.length; i++) {
      values.push(deep[i][2]);
    }
  }
  return values.length > 0 ? values : null;
};

});
