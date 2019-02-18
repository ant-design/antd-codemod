'use strict';

let extended = false;

module.exports = function getExtension(j) {
  if (extended) {
    return {};
  }
  extended = true;
  return {
    // works like `find`, but only get direct nodePaths
    children(type, filter) {
      return this.map(parentPath => {
        const collection = j(parentPath).find(type, filter)
                .filter(childPath => childPath.parentPath === parentPath);
        return collection.paths();
      });
    },
    siblings(type, filter) {
      return this.map(selfPath => {
        const collection = j(selfPath.parentPath).children(type, filter);
        return collection.paths();
      });
    },
    getFunctionDeclaration(nameGetter) {
      /* eslint-disable array-callback-return */
      return this.map(varPath => {
        const currentScope = varPath.scope;
        if (!currentScope) {
          return;
        }
        const functionName = nameGetter(varPath);
        if (!functionName) {
          return;
        }
        const targetScope = currentScope.lookup(functionName);
        if (!targetScope) {
          return;
        }
        const bindings = targetScope.getBindings()[functionName];
        if (!bindings) {
          return;
        }
        const decl = j(bindings).closest(j.FunctionDeclaration);
        if (decl.length === 1) {
          return decl.paths()[0];
        }
      });
      /* eslint-enable array-callback-return */
    },
  };
};
