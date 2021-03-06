var
assert = require("assert"),
deepKeys = require("../deep-keys-lib"),

tests = [{
  operations : [{
    oprn : "pushToHierarchy",
    args : ["a"],
    res  : {
      hierarchy                   : ["a"],
      hierarchyPlaceholder        : ["a"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "",
      hierarchyPlaceholderStr     : "",
      fullHierarchyStr            : "a",
      fullHierarchyPlaceholderStr : "a",
    },
  }, {
    oprn : "pushToHierarchy",
    args : ["b"],
    res  : {
      hierarchy                   : ["a", "b"],
      hierarchyPlaceholder        : ["a", "b"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "a",
      hierarchyPlaceholderStr     : "a",
      fullHierarchyStr            : "a.b",
      fullHierarchyPlaceholderStr : "a.b",
    },
  }, {
    oprn : "pushToHierarchy",
    args : ["c"],
    res  : {
      hierarchy                   : ["a", "b", "c"],
      hierarchyPlaceholder        : ["a", "b", "c"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "a.b",
      hierarchyPlaceholderStr     : "a.b",
      fullHierarchyStr            : "a.b.c",
      fullHierarchyPlaceholderStr : "a.b.c",
    },
  }],
  title : "basic pushToHierarchy",
}, {
  operations : [{
    oprn : "pushToHierarchy",
    args : ["a"],
    res  : {
      hierarchy                   : ["a"],
      hierarchyPlaceholder        : ["a"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "",
      hierarchyPlaceholderStr     : "",
      fullHierarchyStr            : "a",
      fullHierarchyPlaceholderStr : "a",
    },
  }, {
    oprn : "pushToHierarchy",
    args : ["b"],
    res  : {
      hierarchy                   : ["a", "b"],
      hierarchyPlaceholder        : ["a", "b"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "a",
      hierarchyPlaceholderStr     : "a",
      fullHierarchyStr            : "a.b",
      fullHierarchyPlaceholderStr : "a.b",
    },
  }, {
    oprn : "pushToHierarchy",
    args : ["c"],
    res  : {
      hierarchy                   : ["a", "b", "c"],
      hierarchyPlaceholder        : ["a", "b", "c"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "a.b",
      hierarchyPlaceholderStr     : "a.b",
      fullHierarchyStr            : "a.b.c",
      fullHierarchyPlaceholderStr : "a.b.c",
    },
  }, {
    oprn : "popFromHierarchy",
    args : [],
    res  : {
      hierarchy                   : ["a", "b"],
      hierarchyPlaceholder        : ["a", "b"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "a",
      hierarchyPlaceholderStr     : "a",
      fullHierarchyStr            : "a.b",
      fullHierarchyPlaceholderStr : "a.b",
    },
  }, {
    oprn : "popFromHierarchy",
    args : [],
    res  : {
      hierarchy                   : ["a"],
      hierarchyPlaceholder        : ["a"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "",
      hierarchyPlaceholderStr     : "",
      fullHierarchyStr            : "a",
      fullHierarchyPlaceholderStr : "a",
    },
  }, {
    oprn : "popFromHierarchy",
    args : [],
    res  : {
      hierarchy                   : [],
      hierarchyPlaceholder        : [],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "",
      hierarchyPlaceholderStr     : "",
      fullHierarchyStr            : "",
      fullHierarchyPlaceholderStr : "",
    },
  }],
  title : "pushToHierarchy with popFromHierarchy",
}, {
  operations : [{
    oprn : "pushToHierarchy",
    args : ["a"],
    res  : {
      hierarchy                   : ["a"],
      hierarchyPlaceholder        : ["a"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "",
      hierarchyPlaceholderStr     : "",
      fullHierarchyStr            : "a",
      fullHierarchyPlaceholderStr : "a",
    },
  }, {
    oprn : "pushToHierarchy",
    args : ["b", "*"],
    res  : {
      hierarchy                   : ["a", "b"],
      hierarchyPlaceholder        : ["a", "*"],
      hierarchyPlaceholders       : [{
        placeholder : "*",
        index       : 1,
      }],
      hierarchyStr                : "a",
      hierarchyPlaceholderStr     : "a",
      fullHierarchyStr            : "a.b",
      fullHierarchyPlaceholderStr : "a.*",
    },
  }, {
    oprn : "pushToHierarchy",
    args : ["c"],
    res  : {
      hierarchy                   : ["a", "b", "c"],
      hierarchyPlaceholder        : ["a", "*", "c"],
      hierarchyPlaceholders       : [{
        placeholder : "*",
        index       : 1,
      }],
      hierarchyStr                : "a.b",
      hierarchyPlaceholderStr     : "a.*",
      fullHierarchyStr            : "a.b.c",
      fullHierarchyPlaceholderStr : "a.*.c",
    },
  }, {
    oprn : "pushToHierarchy",
    args : ["2", "*"],
    res  : {
      hierarchy                   : ["a", "b", "c", "2"],
      hierarchyPlaceholder        : ["a", "*", "c", "*"],
      hierarchyPlaceholders       : [{
        placeholder : "*",
        index       : 1,
      }, {
        placeholder : "*",
        index       : 3,
      }],
      hierarchyStr                : "a.b.c",
      hierarchyPlaceholderStr     : "a.*.c",
      fullHierarchyStr            : "a.b.c.2",
      fullHierarchyPlaceholderStr : "a.*.c.*",
    },
  }, {
    oprn : "popFromHierarchy",
    args : [],
    res  : {
      hierarchy                   : ["a", "b", "c"],
      hierarchyPlaceholder        : ["a", "*", "c"],
      hierarchyPlaceholders       : [{
        placeholder : "*",
        index       : 1,
      }],
      hierarchyStr                : "a.b",
      hierarchyPlaceholderStr     : "a.*",
      fullHierarchyStr            : "a.b.c",
      fullHierarchyPlaceholderStr : "a.*.c",
    },
  }, {
    oprn : "popFromHierarchy",
    args : [],
    res  : {
      hierarchy                   : ["a", "b"],
      hierarchyPlaceholder        : ["a", "*"],
      hierarchyPlaceholders       : [{
        placeholder : "*",
        index       : 1,
      }],
      hierarchyStr                : "a",
      hierarchyPlaceholderStr     : "a",
      fullHierarchyStr            : "a.b",
      fullHierarchyPlaceholderStr : "a.*",
    },
  }, {
    oprn : "popFromHierarchy",
    args : [],
    res  : {
      hierarchy                   : ["a"],
      hierarchyPlaceholder        : ["a"],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "",
      hierarchyPlaceholderStr     : "",
      fullHierarchyStr            : "a",
      fullHierarchyPlaceholderStr : "a",
    },
  }, {
    oprn : "popFromHierarchy",
    args : [],
    res  : {
      hierarchy                   : [],
      hierarchyPlaceholder        : [],
      hierarchyPlaceholders       : [],
      hierarchyStr                : "",
      hierarchyPlaceholderStr     : "",
      fullHierarchyStr            : "",
      fullHierarchyPlaceholderStr : "",
    },
  }],
  title : "pushToHierarchy with popFromHierarchy with placeholders",
}],

replacePlaceholdersTests = [{
  title : "no placeholders",
  input : {
    hierarchyPlaceholders : [],
    hierarchy : ["a", "b"],
  },
  srcHierarchyPlaceholder : ["a", "b"],
  output : ["a", "b"],
}, {
  title : "simple placeholders",
  input : {
    hierarchyPlaceholders : [{
      placeholder : "*",
      index : 1,
    }],
    hierarchy : ["a", "1", "b"],
  },
  srcHierarchyPlaceholder : ["a", "*", "b", "c"],
  output : ["a", "1", "b", "c"],
}, {
  title : "simple placeholders at different place",
  input : {
    hierarchyPlaceholders : [{
      placeholder : "*",
      index : 1,
    }],
    hierarchy : ["a", "1", "b"],
  },
  srcHierarchyPlaceholder : ["a", "b", "*"],
  output : ["a", "b", "*"],
}, {
  title : "partial placeholder matching",
  input : {
    hierarchyPlaceholders : [{
      placeholder : "*",
      index : 1,
    }, {
      placeholder : "*",
      index : 3,
    }],
    hierarchy : ["a", "1", "b", "c", "d"],
  },
  srcHierarchyPlaceholder : ["a", "*", "c", "*", "d"],
  output : ["a", "1", "c", "*", "d"],
}, {
  title : "partial placeholder matching with lesser amount of keys",
  input : {
    hierarchyPlaceholders : [{
      placeholder : "*",
      index : 1,
    }, {
      placeholder : "*",
      index : 3,
    }],
    hierarchy : ["a", "1", "b", "c", "d"],
  },
  srcHierarchyPlaceholder : ["a", "*", "b", "d"],
  output : ["a", "1", "b", "d"],
}, {
  title : "full placeholder match",
  input : {
    hierarchyPlaceholders : [{
      placeholder : "*",
      index : 1,
    }, {
      placeholder : "*",
      index : 3,
    }],
    hierarchy : ["a", "1", "b", "c", "d"],
  },
  srcHierarchyPlaceholder : ["a", "*", "b", "*"],
  output : ["a", "1", "b", "c"],
}],

updateHierarchy = [{
  title : "updateHierarchy same key",
  initKeys : ["a", "b", "c"],
  initPlaceholderKeys : ["a", "b", "c"],
  updateToKey : "a.b.c",
  updateToPlaceholderKey : "a.b.c",
  res : {
    hierarchy                   : ["a", "b", "c"],
    hierarchyPlaceholder        : ["a", "b", "c"],
    hierarchyPlaceholders       : [],
    hierarchyStr                : "a.b",
    hierarchyPlaceholderStr     : "a.b",
    fullHierarchyStr            : "a.b.c",
    fullHierarchyPlaceholderStr : "a.b.c",
  },
}, {
  title : "updateHierarchy with superset key",
  initKeys : ["a", "b", "c"],
  initPlaceholderKeys : ["a", "b", "c"],
  updateToKey : "a.b",
  updateToPlaceholderKey : "a.b.c",
  res : {
    hierarchy                   : ["a", "b"],
    hierarchyPlaceholder        : ["a", "b"],
    hierarchyPlaceholders       : [],
    hierarchyStr                : "a",
    hierarchyPlaceholderStr     : "a",
    fullHierarchyStr            : "a.b",
    fullHierarchyPlaceholderStr : "a.b",
  },
}, {
  title : "updateHierarchy with a common subset",
  initKeys : ["a", "b", "c"],
  initPlaceholderKeys : ["a", "b", "c"],
  updateToKey : "a.b.d",
  updateToPlaceholderKey : "a.b.d",
  res : {
    hierarchy                   : ["a", "b", "d"],
    hierarchyPlaceholder        : ["a", "b", "d"],
    hierarchyPlaceholders       : [],
    hierarchyStr                : "a.b",
    hierarchyPlaceholderStr     : "a.b",
    fullHierarchyStr            : "a.b.d",
    fullHierarchyPlaceholderStr : "a.b.d",
  },
}, {
  title : "updateHierarchy with array indixes",
  initKeys : ["a", "1", "b"],
  initPlaceholderKeys : ["a", "*", "b"],
  updateToKey : "a.0.c",
  updateToPlaceholderKey : "a.*.c",
  res : {
    hierarchy                   : ["a", "0", "c"],
    hierarchyPlaceholder        : ["a", "*", "c"],
    hierarchyPlaceholders       : [{
      placeholder : "*",
      index : 1,
    }],
    hierarchyStr                : "a.0",
    hierarchyPlaceholderStr     : "a.*",
    fullHierarchyStr            : "a.0.c",
    fullHierarchyPlaceholderStr : "a.*.c",
  },
}];

describe("HierarchyManager", function() {
  for(var i = 0; i < tests.length; i++) {
    (function() {
      var test = tests[i];
      it(test.title, function() {
        var h = new deepKeys.HierarchyManager();
        for(var j = 0; j < test.operations.length; j++) {
          h[test.operations[j].oprn].apply(h, test.operations[j].args);
          assert.deepEqual(test.operations[j].res, h);
        }
      });
    })();
  }

  for(var i = 0; i < replacePlaceholdersTests.length; i++) {
    (function() {
      var test = replacePlaceholdersTests[i];
      it(test.title, function() {
        var h = new deepKeys.HierarchyManager();
        h.hierarchy = test.input.hierarchy;
        h.hierarchyPlaceholders = test.input.hierarchyPlaceholders;

        var op = h.replacePlaceholders(test.srcHierarchyPlaceholder);
        assert.deepEqual(test.output, op);
      });
    })();
  }

  for(var i = 0; i < updateHierarchy.length; i++) {
    (function() {
      var test = updateHierarchy[i];
      it(test.title, function() {
        var h = new deepKeys.HierarchyManager();
        for(var j = 0; j < test.initKeys.length; j++) {
          h.pushToHierarchy(test.initKeys[j], test.initPlaceholderKeys[j]);
        }

        h.updateHierarchy(test.updateToKey, test.updateToPlaceholderKey);

        assert.deepEqual(test.res, h);
      });
    })();
  }
});
