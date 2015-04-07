define([
  "./deepSearch",
], function(deepSearch) {
deepSearch = deepSearch.deepSearch;

var notNone = function(val) {
  return null !== val && undefined !== val;
};

//check whether a deep key exists
//return value : true/false
return {
  exists : function(obj, key) {
    var val = deepSearch(obj, key);
    return notNone(val) && notNone(val[2]);
  },
};

});