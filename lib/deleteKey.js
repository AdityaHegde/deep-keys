var 
deepSearch = require("./deepSearch");

//delete deep key
module.exports = function(obj, key) {
  var deep = deepSearch(obj, key);
  if(deep) {
    delete deep[0][deep[1]];
  }
};

