var
assert = require("assert"),
deepKeys = require("../index"),

tests = [{
  obj : {a : 1},
  key : "a",
  res : {},
  title : "simple key",
}, {
  obj : {a : {b : 1}},
  key : "a.b",
  res : {a : {}},
  title : "deep key within object",
}, {
  obj : {a : [{b : 1}]},
  key : "a.0.b",
  res : {a : [{}]},
  title : "deep key with array index",
}, {
  obj : {a : [{b : 1}]},
  key : "a.0",
  res : {a : []},
  title : "deep key with array index, deleting array index",
}, {
  obj : {a : [{b : 1}, {b : 2}, {c : 3}]},
  key : "a.*.b",
  res : {a : [{}, {}, {c : 3}]},
  title : "key with * on array",
}, {
  obj : {a : [{b : 1}, {b : 2}, {c : 3}]},
  key : "a.*",
  res : {a : [{b : 1}, {b : 2}, {c : 3}]},
  title : "key with * on array on index",
}, {
  obj : {a : {b : {e : 1}, c : {e : 2}, d : {f : 3}}},
  key : "a.*.e",
  res : {a : {b : {}, c : {}, d : {f : 3}}},
  title : "key with * on object",
}, {
  obj : {a : {b : 1, c : 2, d : 3}},
  key : "a.*",
  res : {a : {b : 1, c : 2, d : 3}},
  title : "key with * on object root",
}];

describe("deleteKey", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title + " : " + test.key, function() {
        deepKeys.deleteKey(test.obj, test.key, test.val);
        assert.deepEqual(test.obj, test.res);
      });
    })();
  }
});
