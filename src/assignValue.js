define([
  "./deepSearch",
], function(deepSearch) {
deepSearch = deepSearch.deepSearch;

//assign value to the deep key
return {
  assignValue : function(obj, key, value) {
    var deep = deepSearch(obj, key, 1);
    if(deep) {
      deep[0][deep[1]] = value;
    }
  },
};

});
