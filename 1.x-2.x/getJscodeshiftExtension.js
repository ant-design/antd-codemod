'use strict';

module.exports = function getExtension(j) {
  return {
    // works like `find`, but only get direct nodePaths
    children(type, filter) {
      return this.map(parentPath => {
        const collection = j(parentPath).find(type, filter)
                .filter(childPath => childPath.parentPath === parentPath);
        return collection.__paths;
      });
    },
  };
};
