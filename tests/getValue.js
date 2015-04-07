var
assert = require("assert"),
deepKeys = require("../index"),

obj = {
  a : 1,
  b : 2,
  c : [
    {d : 3},
    {d : 4},
    {d : 5}
  ],
  e : {
    f : 6,
    g : {
      h : 7,
    },
  },
},

tests = [{
  obj : obj,
  key : "",
  res : obj,
  title : "base object",
}, {
  obj : obj,
  key : "a",
  res : 1,
  title : "simple key",
}, {
  obj : obj,
  key : "c.0.d",
  res : 3,
  title : "deep key with array index 1",
}, {
  obj : obj,
  key : "c.2.d",
  res : 5,
  title : "deep key with array index 2",
}, {
  obj : obj,
  key : "e.f",
  res : 6,
  title : "deep key within object 1",
}, {
  obj : obj,
  key : "e.g.h",
  res : 7,
  title : "deep key within object 2",
}, {
  obj : obj,
  key : "x.z",
  res : null,
  title : "key not present",
}];

describe("getValue", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title + " : " + test.key, function() {
        var res = deepKeys.getValue(test.obj, test.key);
        assert.deepEqual(res, test.res);
      });
    })();
  }
});
