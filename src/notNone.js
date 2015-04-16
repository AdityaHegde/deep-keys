define(function() {

/**
 * Check if a value is not null and not undefined.
 *
 * @method notNone
 * @for DeepKeysLib
 * @static
 * @param val {any}
 * @return {Boolean}
 */
return function(val) {
  return null !== val && undefined !== val;
};

});
