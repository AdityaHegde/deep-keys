var
assert = require("assert"),
deepKeys = require("../deep-keys-lib"),

tests = [{
  obj : {a : 1},
  key : "a",
  res : true,
  title : "simple key existing",
}, {
  obj : {a : 1},
  key : "b",
  res : false,
  title : "simple key not existing",
}, {
  obj : {a : {b : 1}},
  key : "a.b",
  res : true,
  title : "deep key existing",
}, {
  obj : {a : {b : 1}},
  key : "c.d",
  res : false,
  title : "deep key not existing",
}, {
  obj : {a : [{b : 1}, {b : 2}]},
  key : "a.1.b",
  res : true,
  title : "deep key with array index existing",
}, {
  obj : {a : [{b : 1}, {b : 2}]},
  key : "a.3.b",
  res : false,
  title : "deep key with array index not existing",
}, {
  obj : {a : [{b : 1}, {b : 2}, {c : 3}]},
  key : "a.*.b",
  or  : true,
  res : true,
  title : "key with * on array with or check",
}, {
  obj : {a : [{b : 1}, {b : 2}, {c : 3}]},
  key : "a.*.b",
  or  : false,
  res : false,
  title : "key with * on array with and check",
}, {
  obj : {a : {b : {e : 1}, c : {e : 2}, d : {f : 3}}},
  key : "a.*.e",
  or  : true,
  res : true,
  title : "key with * on object with or check",
}, {
  obj : {a : {b : {e : 1}, c : {e : 2}, d : {f : 3}}},
  key : "a.*.b",
  or  : false,
  res : false,
  title : "key with * on object with and check",
}];

describe("exists", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title + " : " + test.key, function() {
        var res = deepKeys.exists(test.obj, test.key, test.or);
        assert.equal(res, test.res);
      });
    })();
  }
});
