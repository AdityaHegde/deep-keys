define([
  "./deepSearch",
  "./notNone",
], function(deepSearch, notNone) {
deepSearch = deepSearch.deepSearch;
notNone = notNone.notNone;

/**
 * Get values at a deep key. Returns all values as per key.
 *
 * @method getValue
 * @for DeepKeysLib
 * @static
 * @param obj {Object/Array} Object/array to fetch values from.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @return {Array} Array of values at "key". Returns null if no values are present.
 */
return {
  getValue : function(obj, key) {
    var
    deep = deepSearch(obj, key),
    values = [];
    if(deep) {
      for(var i = 0; i < deep.length; i++) {
        values.push(deep[i][2]);
      }
    }
    return values.length > 0 ? values : null;
  },
};

});
