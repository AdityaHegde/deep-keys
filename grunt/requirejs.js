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
      wrap : {
        startFile: "wrap/start.frag",
        endFile: "wrap/end.frag"
      },

      modules : [
        {
          name : "deep-keys-lib",
          include : ["lib/almond.js"],
        },
      ],
    },
  },
};
