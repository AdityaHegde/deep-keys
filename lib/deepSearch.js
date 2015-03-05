var
getInsertObject = function(nextKey) {
  if(nextKey.match(/^\d+$/)) {
    return [];
  }
  else {
    return {};
  }
};

//private method
//gets the obj at last level of object, last key and the value at the key
//return value : array, [last level of object, last key, value at the last key]
module.exports =  function(obj, key, insert) {
  var keys = key.split(/\./), i = 0;
  for(i = 0; i < keys.length - 1; i++) {
    if(obj[keys[i]]) {
      obj = obj[keys[i]];
    }
    else if(insert) {
      obj[keys[i]] = getInsertObject(keys[i+1]);
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
};
