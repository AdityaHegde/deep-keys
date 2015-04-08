define([
  "./typeOf",
  "./notNone",
  "./deepSearch",
  "./assignValue",
  "./deleteKey",
  "./diff",
  "./exists",
  "./getValue",
  "./replaceKeys",
  "./hierarchy",
], function() {

  /**
   * @module deep-keys-lib
   */

  /**
   * @class DeepKeysLib
   */
  var DeepKeysLib = {};

  for(var i = 0; i < arguments.length; i++) {
    for(var k in arguments[i]) {
      DeepKeysLib[k] = arguments[i][k];
    }
  }

  return DeepKeysLib;

});
