/* istanbul ignore next */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD.
    define([], factory);
  } else if(typeof exports !== "undefined" && exports !== null) {
    // nodejs
    module.exports = factory();
  } else {
    // Browser globals.
    root.DeepKeysLib = factory();
  }
}(this, function() {
/**
 * @license almond 0.3.0 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
/* istanbul ignore next */
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("lib/almond.js", function(){});

define('typeOf',[],function() {

/**
 * Gets the absolute type.
 *
 * @method typeOf
 * @for DeepKeysLib
 * @static
 * @param obj {any}
 * @return {String} type of obj
 */
return {
  typeOf : function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
  },
};

});

define('notNone',[],function() {

/**
 * Check if a value is not null and not undefined.
 *
 * @method notNone
 * @for DeepKeysLib
 * @static
 * @param val {any}
 * @return {Boolean}
 */
var notNone = function(val) {
  return null !== val && undefined !== val;
};

return {
  notNone : notNone,
};

});

define('deepSearch',[
  "./notNone",
  "./typeOf",
], function(notNone, typeOf) {
notNone = notNone.notNone;
typeOf = typeOf.typeOf;

var
getInsertObject = function(nextKey) {
  if(nextKey.match(/^\d+$/)) {
    return [];
  }
  else {
    return {};
  }
},

/**
 * Searches for the value of key. Returns array of matches.
 * Each match has the object at last level, last key and value of the whole key.
 * The key can have "*" to search in all elements of array or all keys in an object.
 *
 * @method deepSearch
 * @for DeepKeysLib
 * @static
 * @param obj {Object|Array} Object/Array to search in.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @param insert {Boolean} To insert keys if not present or not.
 * @return {Array} Array of matches. Each match is an array [object at last level, last key, value of the whole key]. Returns null if no matches are found.
 */
deepSearch = function(obj, key, insert) {
  var keys = key.split(/\./), i = 0;
  for(i = 0; i < keys.length - 1; i++) {
    if(keys[i] === "*") {
      var
      results = [];
      if(typeOf(obj) === "array" || typeOf(obj) === "object") {
        for(var k in obj) {
          var retResults = deepSearch(obj[k], keys.slice(i + 1).join("."), insert);
          if(retResults) {
            Array.prototype.push.apply(results, retResults);
          }
        }
      }
      return results.length > 0 ? results : null;
    }
    else if(notNone(obj[keys[i]])) {
      obj = obj[keys[i]];
    }
    else if(insert) {
      obj[keys[i]] = getInsertObject(keys[i + 1]);
      obj = obj[keys[i]]
    }
    else {
      return null;
    }
  }
  if(keys[i] !== "") {
    //return match only if
    //last obj is array and last key is index
    //or last obj is object
    //and last key is not *
    if(((typeOf(obj) === "array" && keys[i].match(/^\d*$/)) || typeOf(obj) === "object") && keys[i] !== "*") {
      return [[obj, keys[i], obj[keys[i]]]];
    }
    else {
      return null;
    }
  }
  else {
    return [[obj, keys[i], obj]];
  }
};

return {
  deepSearch : deepSearch,
};

});

define('assignValue',[
  "./deepSearch",
], function(deepSearch) {
deepSearch = deepSearch.deepSearch;

/**
 * Assign value at a deep location in an object/array.
 *
 * @method assignValue
 * @for DeepKeysLib
 * @static
 * @param obj {Object|Array} Base object/array to assign to.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @param value {any} Value to assign at "key".
 */
return {
  assignValue : function(obj, key, value) {
    var deep = deepSearch(obj, key, 1);
    if(deep) {
      for(var i = 0; i < deep.length; i++) {
        deep[i][0][deep[i][1]] = value;
      }
    }
  },
};

});

define('deleteKey',[
  "./deepSearch",
], function(deepSearch) {
deepSearch = deepSearch.deepSearch;

/**
 * Deletes a deep key from the last object(s)/array(s)
 *
 * @method deleteKey
 * @for DeepKeysLib
 * @static
 * @param obj {Object|Array} Object/array to delete key from
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 */
return {
  deleteKey : function(obj, key) {
    var deep = deepSearch(obj, key);
    if(deep) {
      for(var i = 0; i < deep.length; i++) {
        delete deep[i][0][deep[i][1]];
      }
    }
  },
};

});

define('hierarchy',[],function() {

/**
 * A manager to handle key hierarchy
 *
 * @class DeepKeysLib.HierarchyManager
 * @static
 */
function HierarchyManager() {
  /**
   * Current hierarchy of keys with actual key.
   *
   * @property hierarchy
   * @for DeepKeysLib.HierarchyManager
   * @type {Array}
   * @readonly
   */
  this.hierarchy             = [];

  /**
   * Current hierarchy of keys with placeholders.
   *
   * @property hierarchyPlaceholder
   * @type {Array}
   * @readonly
   */
  this.hierarchyPlaceholder  = [];

  /**
   * Array of placeholders in order of its presence with indices.
   *
   * @property hierarchyPlaceholders
   * @type {Array}
   * @readonly
   */
  this.hierarchyPlaceholders = [];

  /**
   * String reprensentation of hierarchy joined with "." without the last key.
   *
   * @property hierarchyStr
   * @type {String}
   * @readonly
   */
  this.hierarchyStr                = "";

  /**
   * String reprensentation of hierarchy with placeholders joined with "." without the last key.
   *
   * @property hierarchyPlaceholderStr
   * @type {String}
   * @readonly
   */
  this.hierarchyPlaceholderStr     = "";

  /**
   * Full string reprensentation of hierarchy joined with ".".
   *
   * @property fullHierarchyStr
   * @type {String}
   * @readonly
   */
  this.fullHierarchyStr            = "";

  /**
   * Full string reprensentation of hierarchy with placeholders joined with ".".
   *
   * @property fullHierarchyPlaceholderStr
   * @type {String}
   * @readonly
   */
  this.fullHierarchyPlaceholderStr = "";
};

/**
 * Fills up all placeholders ("*") with actual value from current hierarchy.
 *
 * @method replacePlaceholders
 * @param srcHierarchyPlaceholder {Array} Hierarchy with placeholders to fill up.
 * @return {Array} Hierarchy of placeholders replaced with actual value from current hierarchy.
 */
HierarchyManager.prototype.replacePlaceholders = function(srcHierarchyPlaceholder) {
  var retHierarchy = srcHierarchyPlaceholder.slice();
  for(var i = 0, j = 0; i < this.hierarchy.length && i < retHierarchy.length && j < this.hierarchyPlaceholders.length; i++) {
    if(i === this.hierarchyPlaceholders[j].index) {
      if(retHierarchy[i] === this.hierarchyPlaceholders[j].placeholder) {
        retHierarchy[i] = this.hierarchy[i];
        j++;
      }
      else {
        break;
      }
    }
    else if(this.hierarchy[i] !== retHierarchy[i]) {
      break;
    }
  }
  return retHierarchy;
};

/**
 * Push a key and placeholder to hierarchy.
 *
 * @method pushToHierarchy
 * @param key {String} Key to add to hierarchy.
 * @param [keyPlaceholder] {String} Placeholder key. Defaults to value of key;
 */
HierarchyManager.prototype.pushToHierarchy = function(key, keyPlaceholder) {
  keyPlaceholder = keyPlaceholder || key;
  this.hierarchyStr = this.hierarchy.join(".");
  this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");

  if(key !== keyPlaceholder) {
    this.hierarchyPlaceholders.push({
      placeholder : keyPlaceholder,
      index       : this.hierarchyPlaceholder.length,
    });
  }

  this.hierarchy.push(key);
  this.hierarchyPlaceholder.push(keyPlaceholder);

  this.fullHierarchyStr = this.hierarchy.join(".");
  this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");
};

/**
 * Pop key from hierarchy.
 *
 * @method popFromHierarchy
 */
HierarchyManager.prototype.popFromHierarchy = function() {
  if(this.hierarchyPlaceholders.length > 0 && 
     this.hierarchyPlaceholders[this.hierarchyPlaceholders.length - 1].index === this.hierarchyPlaceholder.length - 1) {
    this.hierarchyPlaceholders.pop();
  }

  this.hierarchy.pop();
  this.hierarchyPlaceholder.pop();

  this.hierarchyStr = this.hierarchy.slice(0, -1).join(".");
  this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.slice(0, -1).join(".");

  this.fullHierarchyStr = this.hierarchy.join(".");
  this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");
};

return {
  HierarchyManager : HierarchyManager
};

});

define('diff',[
  "./typeOf",
  "./hierarchy",
], function(typeOf, HierarchyManager) {
typeOf = typeOf.typeOf;

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
return {
  diff : function(srcObj, tarObj, ignoreKeys) {
    return _diff(srcObj, tarObj, {
      ignoreKeys : ignoreKeys,
      hierarchy  : new HierarchyManager.HierarchyManager(),
    });
  },
};

});

define('exists',[
  "./deepSearch",
  "./notNone",
], function(deepSearch, notNone) {
deepSearch = deepSearch.deepSearch;
notNone = notNone.notNone;

//check whether a deep key exists
//return value : true/false
/**
 * Check whether any/all of values of deep key is present.
 *
 * @method exists
 * @static
 * @param obj {Object|Array} Object/array to check in.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @param [or] {Boolean} Exists check should be or/and. Defaults to and.
 * @return {Boolean} true/false based on presence of all/any values.
 */
return {
  exists : function(obj, key, or) {
    or = !!or;
    var
    val = deepSearch(obj, key),
    exists = !or;
    if(val) {
      for(var i = 0; i < val.length; i++) {
        var e = notNone(val[i][2]);
        exists = (or && (exists || e)) || (!or && (exists && e));
      }
    }
    else {
      exists = false;
    }
    return exists;
  },
};

});

define('getValue',[
  "./deepSearch",
  "./notNone",
], function(deepSearch, notNone) {
deepSearch = deepSearch.deepSearch;
notNone = notNone.notNone;

/**
 * Get values at a deep key. Returns all values as per key.
 *
 * @method getValue
 * @for DeepKeysLib
 * @static
 * @param obj {Object/Array} Object/array to fetch values from.
 * @param key {String} A deep key. Can have "*" at all positions except last. Eg: a.b.c, a.*.b
 * @return {Array} Array of values at "key". Returns null if no values are present.
 */
return {
  getValue : function(obj, key) {
    var
    deep = deepSearch(obj, key),
    values = [];
    if(deep) {
      for(var i = 0; i < deep.length; i++) {
        values.push(deep[i][2]);
      }
    }
    return values.length > 0 ? values : null;
  },
};

});

define('replaceKeys',[
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

define('deep-keys-lib',[
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

  // Register in the values from the outer closure for common dependencies
  // as local almond modules
 
  // Use almond's special top level synchronous require to trigger factory
  // functions, get the final module, and export it as the public api.
  return require('deep-keys-lib');
}));
