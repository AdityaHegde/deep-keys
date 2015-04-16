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
