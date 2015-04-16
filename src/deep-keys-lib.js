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
], function(typeOf, notNone, deepSearch, assignValue, deleteKey, diff, exists, getValue, replaceKeys, HierarchyManager) {

  /**
   * @module deep-keys-lib
   */

  /**
   * @class DeepKeysLib
   */
  var DeepKeysLib = {
    typeOf           : typeOf,
    notNone          : notNone,
    deepSearch       : deepSearch,
    assignValue      : assignValue,
    deleteKey        : deleteKey,
    diff             : diff,
    exists           : exists,
    getValue         : getValue,
    replaceKeys      : replaceKeys,
    HierarchyManager : HierarchyManager,
  };

  return DeepKeysLib;

});
