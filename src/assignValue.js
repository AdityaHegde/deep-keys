define([
  "./deepSearch",
], function(deepSearch) {
deepSearch = deepSearch.deepSearch;

/**
 * Assign value at a deep location in an object/array.
 *
 * @method assignValue
 * @for DeepKeysLib
 * @static
 * @param obj {Object|Array} Base object/array to assign to.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @param value {any} Value to assign at "key".
 */
return {
  assignValue : function(obj, key, value) {
    var deep = deepSearch(obj, key, 1);
    if(deep) {
      for(var i = 0; i < deep.length; i++) {
        deep[i][0][deep[i][1]] = value;
      }
    }
  },
};

});
