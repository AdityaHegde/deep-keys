var
assert = require("assert"),
deleteKey = require("../lib/deleteKey"),

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
}];

describe("deleteKey", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title + " : " + test.key, function() {
        deleteKey(test.obj, test.key, test.val);
        assert.deepEqual(test.obj, test.res);
      });
    })();
  }
});
