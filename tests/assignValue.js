var
assert = require("assert"),
deepKeys = require("../deep-keys-lib"),

tests = [{
  obj : {},
  key : "a",
  val : 1,
  res : {a : 1},
  title : "simple key",
}, {
  obj : {a : {}},
  key : "a.b",
  val : 1,
  res : {a : {b : 1}},
  title : "deep key within object, outer object already present",
}, {
  obj : {},
  key : "a.b",
  val : 1,
  res : {a : {b : 1}},
  title : "deep key within object, outer object not present",
}, {
  obj : {a : [{}]},
  key : "a.0.b",
  val : 1,
  res : {a : [{b : 1}]},
  title : "deep key with array index, outer array already present",
}, {
  obj : {},
  key : "a.0.b",
  val : 1,
  res : {a : [{b : 1}]},
  title : "deep key with array index, outer array not present",
}, {
  obj : {a : [{b : 1}, {}]},
  key : "a.*.b",
  val : 2,
  res : {a : [{b : 2}, {b : 2}]},
  title : "deep key with replacing existing",
}, {
  obj : {a : [{b : 1}, {}]},
  key : "a.*.b",
  val : 2,
  dontReplace : true,
  res : {a : [{b : 1}, {b : 2}]},
  title : "deep key without replacing existing",
}];

describe("assignValue", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title + " : " + test.key, function() {
        deepKeys.assignValue(test.obj, test.key, test.val, test.dontReplace);
        assert.deepEqual(test.obj, test.res);
      });
    })();
  }
});
