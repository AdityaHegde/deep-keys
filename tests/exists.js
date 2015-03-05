var
assert = require("assert"),
exists = require("../lib/exists"),

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
}];

describe("exists", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title + " : " + test.key, function() {
        var res = exists(test.obj, test.key);
        assert.equal(res, test.res);
      });
    })();
  }
});
