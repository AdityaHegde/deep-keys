var 
deepSearch = require("./deepSearch");

//get deep key value
module.exports = function(obj, key) {
  var deep = deepSearch(obj, key);
  return deep && deep[2];
};

