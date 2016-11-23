'use strict';

const getExtension = require('./getJscodeshiftExtension');

module.exports = function(file, api) {
  const j = api.jscodeshift;
  j.registerMethods(getExtension(j));
  const ast = j(file.source);

  ast.find(j.JSXOpeningElement, {
    name: {
      type: 'JSXIdentifier',
      name: 'Popover',
    },
  }).map(nodePath => nodePath.get('attributes'))
    .children(j.JSXAttribute, {
      name: {
        type: 'JSXIdentifier',
        name: 'overlay',
      },
    })
    .map(nodePath => nodePath.get('name'))
    .replaceWith(j.jsxIdentifier('content'));

  return ast.toSource();
};
