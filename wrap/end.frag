  // Register in the values from the outer closure for common dependencies
  // as local almond modules
 
  // Use almond's special top level synchronous require to trigger factory
  // functions, get the final module, and export it as the public api.
  return require('deep-keys-lib');
}));