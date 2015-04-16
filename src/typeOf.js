define(function() {

/**
 * Gets the absolute type.
 *
 * @method typeOf
 * @for DeepKeysLib
 * @static
 * @param obj {any}
 * @return {String} type of obj
 */
return function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

});
