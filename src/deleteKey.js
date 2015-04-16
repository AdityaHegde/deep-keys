define([
  "./deepSearch",
], function(deepSearch) {

/**
 * Deletes a deep key from the last object(s)/array(s)
 *
 * @method deleteKey
 * @for DeepKeysLib
 * @static
 * @param obj {Object|Array} Object/array to delete key from
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @param [expandKeys] {Array} Array of key maps for each * of objects in the key to use intead of all keys. Defaults to all.
 */
return  function(obj, key, expandKeys) {
  var deep = deepSearch(obj, key, false, expandKeys);
  if(deep) {
    for(var i = 0; i < deep.length; i++) {
      delete deep[i][0][deep[i][1]];
    }
  }
};

});
