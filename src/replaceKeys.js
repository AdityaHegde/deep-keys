define([
  "./getValue",
  "./typeOf",
], function(getValue, typeOf) {
typeOf = typeOf.typeOf;
getValue = getValue.getValue;


//replace <key> in obj with value at that key from params
var replaceKeys = function(obj, params) {
  if(typeOf(obj) === "object" || typeOf(obj) === "array") {
    for(var k in obj) {
      obj[k] = replaceKeys(obj[k], params);
    }
  }
  else {
    var parts = obj.match(/<.*?>/g) || [];
    for(var i = 0; i < parts.length; i++) {
      var
      val = getValue(params, parts[i].replace(/<(.*)>/, "$1")),
      regexp = new RegExp(parts[i].replace(/\./, "\\."));
      obj = obj.replace(regexp, val);
    }
  }
  return obj;
};

return {
  replaceKeys : replaceKeys,
};

});
