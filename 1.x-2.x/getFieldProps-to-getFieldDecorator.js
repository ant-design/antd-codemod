'use strict';

const getFieldPropsIdentifier = {
  type: 'Identifier',
  name: 'getFieldProps',
};
const getFieldPropsCallExpression = {
  callee: getFieldPropsIdentifier,
};

function propsToDecorator(name) {
  return name.replace('Props', 'Decorator');
}

function processGetFieldPropsInJSX(j, getFieldPropsNodes) {
  // wrap form controls with `getFieldDecorator(...)`
  const getFieldPropsInJSXNodes = getFieldPropsNodes
          .filter(nodePath => j.JSXSpreadAttribute.check(nodePath.parentPath.value));
  getFieldPropsInJSXNodes.closest(j.JSXElement)
    .replaceWith(nodePath => {
      const getFieldPropsNode = j(nodePath)
              .find(j.CallExpression, getFieldPropsCallExpression).nodes()[0];
      const callExpression = j.callExpression(
        j.callExpression(getFieldPropsNode.callee, getFieldPropsNode.arguments),
        [ nodePath.value ]
      );
      if (j.JSXElement.check(nodePath.parentPath.parentPath.value)) {
        return j.jsxExpressionContainer(callExpression);
      }
      return callExpression;
    });
  // remove `getFieldProps` in JSX
  getFieldPropsInJSXNodes.closest(j.JSXSpreadAttribute).remove();
}

function processGetFieldPropsWithTmp(j, getFieldPropsNodes) {
  const tmpPropsIdentifierNodes = getFieldPropsNodes
          .filter(nodePath => j.VariableDeclarator.check(nodePath.parentPath.value))
          .closest(j.VariableDeclarator)
          .map(nodePath => nodePath.get('id'));
  // replace `<input {...nameProps} />` with `nameDecorator(<input />)`
  const spreadPropsInJSXNodes = tmpPropsIdentifierNodes.map(nodePath => {
    return j(nodePath).closestScope()
      .find(j.JSXSpreadAttribute, {
        argument: {
          type: 'Identifier',
          name: nodePath.value.name,
        },
      })
      .get();
  });
  spreadPropsInJSXNodes.forEach(spreadProps => {
    const relativeJSXElement = j(spreadProps).closest(j.JSXElement);
    relativeJSXElement.replaceWith(nodePath => {
      const callExpression = j.callExpression(
        j.identifier(propsToDecorator(spreadProps.value.argument.name)),
        relativeJSXElement.nodes()
      );
      if (j.JSXElement.check(nodePath.parentPath.parentPath.value)) {
        return j.jsxExpressionContainer(callExpression);
      }
      return callExpression;
    });
  });
  spreadPropsInJSXNodes.remove();
  // replace `const nameProps = getFieldProps(...)` with `const nameDecorator = getFieldDecorator`
  tmpPropsIdentifierNodes.replaceWith(nodePath => j.identifier(propsToDecorator(nodePath.value.name)));
}

module.exports = function(file, api) {
  const j = api.jscodeshift;
  const ast = j(file.source);

  const getFieldPropsNodes = ast.find(j.CallExpression, getFieldPropsCallExpression);
  processGetFieldPropsInJSX(j, getFieldPropsNodes);
  processGetFieldPropsWithTmp(j, getFieldPropsNodes);

  // rename `getFieldProps` to `getFieldDecorator`
  ast.find(j.Identifier, getFieldPropsIdentifier)
    .replaceWith(j.identifier('getFieldDecorator'));

  return ast.toSource();
};
