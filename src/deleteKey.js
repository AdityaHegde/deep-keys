define([
  "./deepSearch",
], function(deepSearch) {
deepSearch = deepSearch.deepSearch;

//delete deep key
return {
  deleteKey : function(obj, key) {
    var deep = deepSearch(obj, key);
    if(deep) {
      delete deep[0][deep[1]];
    }
  },
};

});
