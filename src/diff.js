define([
  "./typeOf",
  "./hierarchy",
], function(typeOf, HierarchyManager) {

//private method
//the actual method that calculates diff
//meta : {
//  ignoreKeys : {},
//  hierarchy  : instance of HierarchyManager,
var _diff = function(srcObj, tarObj, meta) {
  var
  diffObj,
  hasDiff = 0;
  if(typeOf(srcObj) === "object") {
    if(typeOf(tarObj) === "object") {
      diffObj = {};
      for(var k in tarObj) {
        meta.hierarchy.pushToHierarchy(k);
        var d = undefined;
        if(!meta.ignoreKeys[meta.hierarchy.fullHierarchyStr]) {
          d = _diff(srcObj[k], tarObj[k], meta);
        }
        meta.hierarchy.popFromHierarchy();
        if(d !== undefined) {
          diffObj[k] = d;
          hasDiff = 1;
        }
      }
    }
  }
  else if(typeOf(srcObj) === "array") {
    if(typeOf(tarObj) === "array") {
      diffObj = [];
      for(var i = 0; i < tarObj.length; i++) {
        meta.hierarchy.pushToHierarchy(i, "*");
        var d = undefined;
        if(!meta.ignoreKeys[meta.hierarchy.fullHierarchyStr]) {
          d = _diff(srcObj[i], tarObj[i], meta);
        }
        meta.hierarchy.popFromHierarchy();
        diffObj.push(d);
        if(d !== undefined) {
          hasDiff = 1;
        }
      }
    }
  }
  else {
    if(!meta.ignoreKeys[meta.hierarchy.fullHierarchyStr]) {
      if(srcObj !== tarObj) {
        diffObj = tarObj;
        hasDiff = 1;
      }
    }
  }
  return hasDiff === 1 ? diffObj : undefined;
};

/**
 * Method to calculate diff of 2 javascript objects. It only gives the additional data on tarObj over srcObj.
 * Also accepts a deepKey representation (a : {b : 1} => a.b) of keys to ignore.
 *
 * @method diff
 * @for DeepKeysLib
 * @static
 * @param srcObj {Object/Array} Source object/array.
 * @param tarObj {Object/Array} Target object/array.
 * @param ignoreKeys {Object} A map of deepKeys to ignore. Has support for * on arrays but not objects.
 * @return {Object/Array} The diff object/array.
 */
//TODO : make this 2 way diff
return function(srcObj, tarObj, ignoreKeys) {
  return _diff(srcObj, tarObj, {
    ignoreKeys : ignoreKeys,
    hierarchy  : new HierarchyManager(),
  });
};

});
