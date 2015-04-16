define([
  "./deepSearch",
], function(deepSearch) {

/**
 * Assign value at a deep location in an object/array.
 *
 * @method assignValue
 * @for DeepKeysLib
 * @static
 * @param obj {Object|Array} Base object/array to assign to.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @param value {any} Value to assign at "key".
 * @param [dontReplace] {Boolean} Replace existing values or not. Defaults to false.
 * @param [expandKeys] {Array} Array of key maps for each * of objects in the key to use intead of all keys. Defaults to all.
 */
return function(obj, key, value, dontReplace, expandKeys) {
  var deep = deepSearch(obj, key, true, expandKeys);
  if(deep) {
    for(var i = 0; i < deep.length; i++) {
      if(!dontReplace || (deep[i][0][deep[i][1]] === null || deep[i][0][deep[i][1]] === undefined)) {
        deep[i][0][deep[i][1]] = value;
      }
    }
  }
};

});
