define([
  "./deepSearch",
  "./notNone",
], function(deepSearch, notNone) {
deepSearch = deepSearch.deepSearch;
notNone = notNone.notNone;

//check whether a deep key exists
//return value : true/false
/**
 * Check whether any/all of values of deep key is present.
 *
 * @method exists
 * @static
 * @param obj {Object|Array} Object/array to check in.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @param [or] {Boolean} Exists check should be or/and. Defaults to and.
 * @return {Boolean} true/false based on presence of all/any values.
 */
return {
  exists : function(obj, key, or) {
    or = !!or;
    var
    val = deepSearch(obj, key),
    exists = !or;
    if(val) {
      for(var i = 0; i < val.length; i++) {
        var e = notNone(val[i][2]);
        exists = (or && (exists || e)) || (!or && (exists && e));
      }
    }
    else {
      exists = false;
    }
    return exists;
  },
};

});
