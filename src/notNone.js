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
var notNone = function(val) {
  return null !== val && undefined !== val;
};

return {
  notNone : notNone,
};

});
