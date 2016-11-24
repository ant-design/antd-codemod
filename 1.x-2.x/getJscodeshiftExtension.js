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
        return collection.__paths;
      });
    },
    siblings(type, filter) {
      return this.map(selfPath => {
        const collection = j(selfPath.parentPath).children(type, filter);
        return collection.__paths;
      });
    },
  };
};
