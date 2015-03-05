var 
deepSearch = require("./deepSearch"),

notNone = function(val) {
  return null !== val && undefined !== val;
};

//check whether a deep key exists
//return value : true/false
module.exports = function(obj, key) {
  var val = deepSearch(obj, key);
  return notNone(val) && notNone(val[2]);
};

