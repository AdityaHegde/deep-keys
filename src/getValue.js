define([
  "./deepSearch",
], function(deepSearch) {
deepSearch = deepSearch.deepSearch;

//get deep key value
return {
  getValue : function(obj, key) {
    var deep = deepSearch(obj, key);
    return deep && deep[2];
  },
};

});
