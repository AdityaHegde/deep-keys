define([
  "./getValue",
  "./typeOf",
  "./notNone",
], function(getValue, typeOf, notNone) {
typeOf = typeOf.typeOf;
getValue = getValue.getValue;
notNone = notNone.notNone;

/**
 * Replaces all instances of <key> in source object.
 * If obj is of object/array type then replaceKeys is called for each value/element respectively.
 * For any other value, <key> is replaced with value in the obj.
 *
 * @method replaceKeys
 * @for DeepKeysLib
 * @static
 * @param obj {any} Object to replace in.
 * @param params {Object} Params to get value from for each <key>.
 * @return {any} Value with <key> replaced.
 */
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
      if(val && notNone(val[0])) {
        obj = obj.replace(regexp, val[0]);
      }
    }
  }
  return obj;
};

return {
  replaceKeys : replaceKeys,
};

});
