var
assert = require("assert"),
deepSearch = require("../lib/deepSearch"),

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
  res : [obj, "", obj],
  title : "base object",
}, {
  obj : obj,
  key : "a",
  res : [obj, "a", 1],
  title : "simple key",
}, {
  obj : obj,
  key : "c.0.d",
  res : [obj.c[0], "d", 3],
  title : "deep key with array index 1",
}, {
  obj : obj,
  key : "c.2.d",
  res : [obj.c[2], "d", 5],
  title : "deep key with array index 2",
}, {
  obj : obj,
  key : "e.f",
  res : [obj.e, "f", 6],
  title : "deep key within object 1",
}, {
  obj : obj,
  key : "e.g.h",
  res : [obj.e.g, "h", 7],
  title : "deep key within object 2",
}, {
  obj : obj,
  key : "x.z",
  res : null,
  title : "key not present",
}],

insertTests = [{
  obj : {
    a : {},
  },
  key : "a.b.c",
  res : [{}, "c", undefined],
  resObj : {
    a : {b : {}},
  },
  title  : "key not present with insert and only objects",
}, {
  obj : {
    a : {},
  },
  key : "a.b.0",
  res : [[], "0", undefined],
  resObj : {
    a : {b : []},
  },
  title  : "key not present with insert and only objects, next key is a number",
}, {
  obj : {
    a : [],
  },
  key : "a.0.b.c",
  res : [{}, "c", undefined],
  resObj : {
    a : [{b : {}}],
  },
  title  : "key not present with insert and arrays",
}];

describe("deepSearch", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title + " : " + test.key, function() {
        var res = deepSearch(test.obj, test.key);
        assert.deepEqual(res, test.res);
      });
    })();
  }

  for(var i = 0; i < insertTests.length; i++) {
    (function() {
      var test = insertTests[i];
      it(test.title + " : " + test.key, function() {
        var res = deepSearch(test.obj, test.key, 1);
        assert.deepEqual(res, test.res);
        assert.deepEqual(test.obj, test.resObj);
      });
    })();
  }
});
