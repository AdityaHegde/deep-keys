module.exports = {
  dist : {
    options : {
      wrap : false,
      aggressiveOptimizations : true,
      esprima : {
        comment : false,
      },
      escodegen : {
        comment : false,
      },
    },
    src : "build/deep-keys-lib.js",
    dest : "build/deep-keys-lib.clean.js",
  },
};
