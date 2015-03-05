var 
deepSearch = require("./deepSearch");

//assign value to the deep key
module.exports = function(obj, key, value) {
  var deep = deepSearch(obj, key, 1);
  if(deep) {
    deep[0][deep[1]] = value;
  }
};

