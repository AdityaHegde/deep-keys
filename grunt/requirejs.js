module.exports = {
  compile : {
    options : {
      baseUrl : "src",
      dir : "build",

      fileExclusionRegExp : /^(?:\.|_)/,
      findNestedDependencies : true,
      skipDirOptimize : true,
      removeCombined : true,
      optimize : "none",

      modules : [
        {
          name : "deep-keys-lib",
        },
      ],
    },
  },
};
