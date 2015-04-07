define([
  "./typeOf",
  "./assignValue",
  "./deepSearch",
  "./deleteKey",
  "./diff",
  "./exists",
  "./getValue",
  "./replaceKeys",
], function() {

  var DeepKeys = {};

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      DeepKeys[k] = arguments[i][k];
    }
  }

  return DeepKeys;

});
