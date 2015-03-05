var
assert = require("assert"),
assignValue = require("../lib/assignValue"),

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
}];

describe("assignValue", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title + " : " + test.key, function() {
        assignValue(test.obj, test.key, test.val);
        assert.deepEqual(test.obj, test.res);
      });
    })();
  }
});
