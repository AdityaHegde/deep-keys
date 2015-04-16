define(function() {

/**
 * A manager to handle key hierarchy
 *
 * @class DeepKeysLib.HierarchyManager
 * @static
 */
function HierarchyManager() {
  /**
   * Current hierarchy of keys with actual key.
   *
   * @property hierarchy
   * @for DeepKeysLib.HierarchyManager
   * @type {Array}
   * @readonly
   */
  this.hierarchy             = [];

  /**
   * Current hierarchy of keys with placeholders.
   *
   * @property hierarchyPlaceholder
   * @type {Array}
   * @readonly
   */
  this.hierarchyPlaceholder  = [];

  /**
   * Array of placeholders in order of its presence with indices.
   *
   * @property hierarchyPlaceholders
   * @type {Array}
   * @readonly
   */
  this.hierarchyPlaceholders = [];

  /**
   * String reprensentation of hierarchy joined with "." without the last key.
   *
   * @property hierarchyStr
   * @type {String}
   * @readonly
   */
  this.hierarchyStr                = "";

  /**
   * String reprensentation of hierarchy with placeholders joined with "." without the last key.
   *
   * @property hierarchyPlaceholderStr
   * @type {String}
   * @readonly
   */
  this.hierarchyPlaceholderStr     = "";

  /**
   * Full string reprensentation of hierarchy joined with ".".
   *
   * @property fullHierarchyStr
   * @type {String}
   * @readonly
   */
  this.fullHierarchyStr            = "";

  /**
   * Full string reprensentation of hierarchy with placeholders joined with ".".
   *
   * @property fullHierarchyPlaceholderStr
   * @type {String}
   * @readonly
   */
  this.fullHierarchyPlaceholderStr = "";
};

/**
 * Fills up all placeholders ("*") with actual value from current hierarchy.
 *
 * @method replacePlaceholders
 * @param srcHierarchyPlaceholder {Array} Hierarchy with placeholders to fill up.
 * @return {Array} Hierarchy of placeholders replaced with actual value from current hierarchy.
 */
HierarchyManager.prototype.replacePlaceholders = function(srcHierarchyPlaceholder) {
  var retHierarchy = srcHierarchyPlaceholder.slice();
  for(var i = 0, j = 0; i < this.hierarchy.length && i < retHierarchy.length && j < this.hierarchyPlaceholders.length; i++) {
    if(i === this.hierarchyPlaceholders[j].index) {
      if(retHierarchy[i] === this.hierarchyPlaceholders[j].placeholder) {
        retHierarchy[i] = this.hierarchy[i];
        j++;
      }
      else {
        break;
      }
    }
    else if(this.hierarchy[i] !== retHierarchy[i]) {
      break;
    }
  }
  return retHierarchy;
};

/**
 * Push a key and placeholder to hierarchy.
 *
 * @method pushToHierarchy
 * @param key {String} Key to add to hierarchy.
 * @param [keyPlaceholder] {String} Placeholder key. Defaults to value of key;
 */
HierarchyManager.prototype.pushToHierarchy = function(key, keyPlaceholder) {
  keyPlaceholder = keyPlaceholder || key;
  this.hierarchyStr = this.hierarchy.join(".");
  this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");

  if(key !== keyPlaceholder) {
    this.hierarchyPlaceholders.push({
      placeholder : keyPlaceholder,
      index       : this.hierarchyPlaceholder.length,
    });
  }

  this.hierarchy.push(key);
  this.hierarchyPlaceholder.push(keyPlaceholder);

  this.fullHierarchyStr = this.hierarchy.join(".");
  this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");
};

/**
 * Pop key from hierarchy.
 *
 * @method popFromHierarchy
 */
HierarchyManager.prototype.popFromHierarchy = function() {
  if(this.hierarchyPlaceholders.length > 0 && 
     this.hierarchyPlaceholders[this.hierarchyPlaceholders.length - 1].index === this.hierarchyPlaceholder.length - 1) {
    this.hierarchyPlaceholders.pop();
  }

  this.hierarchy.pop();
  this.hierarchyPlaceholder.pop();

  this.hierarchyStr = this.hierarchy.slice(0, -1).join(".");
  this.hierarchyPlaceholderStr = this.hierarchyPlaceholder.slice(0, -1).join(".");

  this.fullHierarchyStr = this.hierarchy.join(".");
  this.fullHierarchyPlaceholderStr = this.hierarchyPlaceholder.join(".");
};

return HierarchyManager;

});
