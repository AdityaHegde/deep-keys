define([
  "./deepSearch",
], function(deepSearch) {
deepSearch = deepSearch.deepSearch;

/**
 * Deletes a deep key from the last object(s)/array(s)
 *
 * @method deleteKey
 * @for DeepKeysLib
 * @static
 * @param obj {Object|Array} Object/array to delete key from
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 */
return {
  deleteKey : function(obj, key) {
    var deep = deepSearch(obj, key);
    if(deep) {
      for(var i = 0; i < deep.length; i++) {
        delete deep[i][0][deep[i][1]];
      }
    }
  },
};

});
