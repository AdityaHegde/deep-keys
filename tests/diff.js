var
assert = require("assert"),
deepKeys = require("../index"),

tests = [{
  src   : {a : 1, b : 1},
  tar   : {a : 1, b : 1},
  diff  : undefined,
  title : "Equal objects",
  ignoreKeys : {},
}, {
  src   : {a : 1, b : 1},
  tar   : {a : 1, b : 2},
  diff  : {b : 2},
  title : "Simple diff",
  ignoreKeys : {},
}, {
  src   : {a : 1, b : {c : 2, d : 3}},
  tar   : {b : {c : 3, d : 3}},
  diff  : {b : {c : 3}},
  title : "Deep keys diff",
  ignoreKeys : {},
}, {
  src   : {a : [{b : 1}, {b : 2}]},
  tar   : {a : [{b : 1}, {b : 2}, {b : 4}]},
  diff  : {a : [undefined, undefined, {b : 4}]},
  title : "Array diff 1",
  ignoreKeys : {},
}, {
  src   : {a : [{b : 1}, {b : 2}]},
  tar   : {a : [{b : 2}, {b : 2}, {b : 4}]},
  diff  : {a : [{b : 2}, undefined, {b : 4}]},
  title : "Array diff 2",
  ignoreKeys : {},
}, {
  src   : {a : 1, b : {c : 2, d : 3}},
  tar   : {b : {c : 3, d : 3}},
  diff  : undefined,
  title : "Deep keys diff",
  ignoreKeys : {b : 1},
}];

describe("diff", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title, function() {
        var d = deepKeys.diff(test.src, test.tar, test.ignoreKeys);
        assert.deepEqual(d, test.diff);
      });
    })();
  }
});
