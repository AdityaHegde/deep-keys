var
assert = require("assert"),
deepKeys = require("../index"),

tests = [{
  obj    : "*<a>*",
  params : {a : 1},
  res    : "*1*",
  title  : "simple string",
}, {
  obj    : {a : "*<a>*"},
  params : {a : 1},
  res    : {a : "*1*"},
  title  : "javascript object",
}, {
  obj    : {a : [{b : "*<a>*"}]},
  params : {a : 1},
  res    : {a : [{b : "*1*"}]},
  title  : "javascript object with arrays",
}, {
  obj    : {a : [{b : "*<a.b>*"}]},
  params : {a : {b : 2}},
  res    : {a : [{b : "*2*"}]},
  title  : "javascript object with replace key as a deepKey",
}];

describe("replaceKeys", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title, function() {
        var res = deepKeys.replaceKeys(test.obj, test.params);
        assert.deepEqual(res, test.res);
      });
    })();
  }
});
