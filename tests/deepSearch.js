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
    2 : "numeric key",
  },
  i : {
    a : {
      d : 1,
    },
    b : {
      d : 2,
    },
    c : 1,
    d : [1, 2, 3],
    e : {
      d : 3,
    },
  },
},

tests = [{
  obj : obj,
  key : "a.b",
  res : null,
  title : "deep key on a non object value",
}, {
  obj : obj,
  key : "",
  res : [[obj, "", obj]],
  title : "base object",
}, {
  obj : obj,
  key : "a",
  res : [[obj, "a", 1]],
  title : "simple key",
}, {
  obj : obj,
  key : "c.0.d",
  res : [[obj.c[0], "d", 3]],
  title : "deep key with array index 1",
}, {
  obj : obj,
  key : "c.2.d",
  res : [[obj.c[2], "d", 5]],
  title : "deep key with array index 2",
}, {
  obj : obj,
  key : "e.f",
  res : [[obj.e, "f", 6]],
  title : "deep key within object 1",
}, {
  obj : obj,
  key : "e.g.h",
  res : [[obj.e.g, "h", 7]],
  title : "deep key within object 2",
}, {
  obj : obj,
  key : "x.z",
  res : null,
  title : "key not present",
}, {
  obj : obj,
  key : "e.0",
  res : [[obj.e, "0", undefined]],
  title : "object with numberic key not present",
}, {
  obj : obj,
  key : "e.2",
  res : [[obj.e, "2", "numeric key"]],
  title : "object with numeric key present",
}, {
  obj : obj,
  key : "c.d",
  res : null,
  title : "array with non numeric key",
}, {
  obj : obj,
  key : "c.*.d",
  res : [
    [obj.c[0], "d", 3],
    [obj.c[1], "d", 4],
    [obj.c[2], "d", 5],
  ],
  title : "key with * on array"
}, {
  obj : obj,
  key : "i.*.d",
  res : [
    [obj.i.a, "d", 1],
    [obj.i.b, "d", 2],
    [obj.i.e, "d", 3],
  ],
  title : "key with * on object"
}, {
  obj : obj,
  key : "i.*",
  res : null,
  title : "key with * at end"
}],

insertTests = [{
  obj : {
    a : {},
  },
  key : "a.b.c",
  res : [[{}, "c", undefined]],
  resObj : {
    a : {b : {}},
  },
  title  : "key not present with insert and only objects",
}, {
  obj : {
    a : {},
  },
  key : "a.b.0",
  res : [[[], "0", undefined]],
  resObj : {
    a : {b : []},
  },
  title  : "key not present with insert and only objects, next key is a number",
}, {
  obj : {
    a : [],
  },
  key : "a.0.b.c",
  res : [[{}, "c", undefined]],
  resObj : {
    a : [{b : {}}],
  },
  title  : "key not present with insert and arrays",
}, {
  obj : {
    a : [{b : {}}],
  },
  key : "a.0.b.c",
  res : [[{}, "c", undefined]],
  resObj : {
    a : [{b : {}}],
  },
  title  : "last key not present in insert",
}, {
  obj : {
  },
  key : "a.*.b",
  res : null,
  resObj : {
    a : {},
  },
  title  : "key with * not present with insert",
}];

describe("deepSearch", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title + " : " + test.key, function() {
        var res = deepKeys.deepSearch(test.obj, test.key);
        assert.deepEqual(res, test.res);
      });
    })();
  }

  for(var i = 0; i < insertTests.length; i++) {
    (function() {
      var test = insertTests[i];
      it(test.title + " : " + test.key, function() {
        var res = deepKeys.deepSearch(test.obj, test.key, 1);
        assert.deepEqual(res, test.res);
        assert.deepEqual(test.obj, test.resObj);
      });
    })();
  }
});
