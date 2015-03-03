var 
typeOf = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
},

//private method
//gets the obj at last level of object, last key and the value at the key
//return value : array, [last level of object, last key, value at the last key]
_deepSearch = function(obj, key, insert) {
  var keys = key.split(/\./), i = 0;
  for(i = 0; i < keys.length - 1; i++) {
    if(obj[keys[i]]) {
      obj = obj[keys[i]];
    }
    else if(insert) {
      obj[keys[i]] = {};
      obj = obj[keys[i]]
    }
    else {
      return null;
    }
  }
  if(keys[i] !== "") {
    return [obj, keys[i], obj[keys[i]]];
  }
  else {
    return [obj, keys[i], obj];
  }
},

//private method
//the actual method that calculates diff
//meta : {
//  ignoreKeys : {},
//  hierarchy : [],
//  hierarchyActual : [],
_diff = function(srcObj, tarObj, meta) {
  var
  diffObj,
  hasDiff = 0,
  fullKey = meta.hierarchy.join("."),
  fullKeyActual = meta.hierarchyActual.join(".");
  if(typeOf(srcObj) === "object") {
    //console.log("Object : " + fullKeyActual);
    if(typeOf(tarObj) === "object") {
      diffObj = {};
      for(var k in tarObj) {
        meta.hierarchy.push(k);
        meta.hierarchyActual.push(k);
        var d = undefined;
        if(!meta.ignoreKeys[meta.hierarchy.join(".")]) {
          d = _diff(srcObj[k], tarObj[k], meta);
        }
        meta.hierarchyActual.pop();
        meta.hierarchy.pop();
        if(d !== undefined) {
          diffObj[k] = d;
          hasDiff = 1;
        }
      }
    }
  }
  else if(typeOf(srcObj) === "array") {
    //console.log("Array : " + fullKeyActual);
    if(typeOf(tarObj) === "array") {
      diffObj = [];
      for(var i = 0; i < tarObj.length; i++) {
        meta.hierarchy.push("@");
        meta.hierarchyActual.push(i);
        var d = undefined;
        if(!meta.ignoreKeys[meta.hierarchy.join(".")]) {
          d = _diff(srcObj[i], tarObj[i], meta);
        }
        meta.hierarchyActual.pop();
        meta.hierarchy.pop();
        diffObj.push(d);
        if(d !== undefined) {
          hasDiff = 1;
        }
      }
    }
  }
  else {
    //console.log("Scalar : " + fullKeyActual);
    if(!meta.ignoreKeys[fullKey]) {
      if(srcObj !== tarObj) {
        diffObj = tarObj;
        hasDiff = 1;
      }
    }
  }
  return hasDiff === 1 ? diffObj : undefined;
},

deepKey = {
  //check whether a deep key exists
  //return value : true/false
  exists : function(obj, key) {
    var val = _deepSearch(obj, key);
    return exists(val) && exists(val[2]);
  },

  //assign value to the deep key
  assignValue : function(obj, key, value) {
    var deep = _deepSearch(obj, key, 1);
    if(deep) {
      deep[0][deep[1]] = value;
    }
  },

  //get deep key value
  getValue : function(obj, key) {
    var deep = _deepSearch(obj, key);
    return deep && deep[2];
  },

  //delete deep key
  deleteKey : function(obj, key) {
    var deep = _deepSearch(obj, key);
    if(deep) {
      delete deep[0][deep[1]];
    }
  },

  //replace <key> in obj with value at that key from params
  replaceKeys : function(obj, params) {
    if(typeOf(obj) === "object" || typeOf(obj) === "array") {
      for(var k in obj) {
        obj[k] = deepKey.replaceKeys(obj[k], params);
      }
    }
    else {
      var parts = obj.match(/<.*?>/g) || [];
      //console.log(parts);
      for(var i = 0; i < parts.length; i++) {
        var
        val = deepKey.getValue(params, parts[i].replace(/<(.*)>/, "$1")),
        regexp = new RegExp(parts[i].replace(/\./, "\\."));
        //console.log(parts[i] + " : " + val);
        obj = obj.replace(regexp, val);
      }
    }
    return obj;
  },

  //gets the diff object (array or plain object only)
  diff : function(srcObj, tarObj, ignoreKeys) {
    return _diff(srcObj, tarObj, {
      ignoreKeys : ignoreKeys,
      hierarchy  : [],
      hierarchyActual : [],
    });
  },
};

module.exports = deepKey;
