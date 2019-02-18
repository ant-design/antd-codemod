'use strict';

const getExtension = require('./getJscodeshiftExtension');
const utils = require('./utils');

function isCallbackWithDateObject(attributeName) {
  return [
    'disabledDate', 'disabledTime', 'onChange',
    'dateCellRender', 'monthCellRender', 'onPanelChange',
  ].indexOf(attributeName) > -1;
}

const apisMap = {
  getTime: 'valueOf',
  getDayOfMonth: 'date',
  getMonth: 'month',
};
function getMomentAPI(gregorianCalendarAPI) {
  return apisMap[gregorianCalendarAPI] || gregorianCalendarAPI;
}

function getMethodName(expressionPath) {
  // this.xxx
  const name = expressionPath.get('property').get('name').value;
  if (!name) {
    // this.xxx.bind(this)
    return expressionPath
      .get('callee')
      .get('object')
      .get('property')
      .get('name').value;
  }
  return name;
}

module.exports = function(file, api) {
  const j = api.jscodeshift;
  j.registerMethods(getExtension(j));
  const ast = j(file.source);

  function replaceGregorianCalendarAPIToMoment(functionExpressionPath) {
    const firstArgument = functionExpressionPath.get('params').value[0];
    if (!firstArgument) {
      return;
    }
    const firstArgumentName = firstArgument.name;
    j(functionExpressionPath.get('body'))
      .find(j.CallExpression, {
        callee: {
          type: 'MemberExpression',
          object: {
            name: firstArgumentName,
          },
        },
      })
      .map(nodePath => nodePath.get('callee').get('property'))
      .replaceWith(nodePath => j.identifier(getMomentAPI(nodePath.get('name').value)));
  }

  const callbackExpression = ast.find(j.JSXOpeningElement)
          .filter(nodePath => utils.isTimeRelatedComponent(utils.getNameFieldValue(nodePath)))
          .map(nodePath => nodePath.get('attributes'))
          .children(j.JSXAttribute)
          .filter(nodePath => isCallbackWithDateObject(utils.getNameFieldValue(nodePath)))
          .map(nodePath => nodePath.get('value').get('expression'));

  callbackExpression.filter(nodePath => j.Identifier.check(nodePath.value))
    .getVariableDeclarators(nodePath => nodePath.get('name').value)
    .map(nodePath => nodePath.get('init'))
    .forEach(replaceGregorianCalendarAPIToMoment);
  callbackExpression.filter(nodePath => j.Identifier.check(nodePath.value))
    .getFunctionDeclaration(nodePath => nodePath.get('name').value)
    .forEach(replaceGregorianCalendarAPIToMoment);

  function isFromThis(nodePath) {
    // this.xxx
    return j.MemberExpression.check(nodePath.value) &&
      j.ThisExpression.check(nodePath.get('object').value) ||
      // this.xxx.bind(this)
      j.CallExpression.check(nodePath.value) &&
      utils.matchNode(nodePath.value, {
        callee: {
          type: 'MemberExpression',
          object: {
            type: 'MemberExpression',
            object: { type: 'ThisExpression' },
          },
          property: { name: 'bind' },
        },
        arguments: [{ type: 'ThisExpression' }],
      }) && nodePath.value.arguments.length === 1;
  }
  const callbackFromThis = callbackExpression.filter(isFromThis);
  callbackFromThis
    .map(expressionPath => {
      return j(expressionPath)
        .closest(j.CallExpression, {
          callee: {
            type: 'MemberExpression',
            object: {
              name: 'React',
            },
            property: {
              name: 'createClass',
            },
          },
        })
        .map(nodePath => nodePath.get('arguments'))
        .children(j.ObjectExpression)
        .map(nodePath => nodePath.get('properties'))
        .children(j.Property)
        .filter(propertyPath => {
          return propertyPath.get('key').get('name').value ===
            getMethodName(expressionPath);
        })
        .map(nodePath => nodePath.get('value'))
        .paths();
    })
    .forEach(replaceGregorianCalendarAPIToMoment);
  callbackFromThis
    .map(expressionPath => {
      const classDefinition = j(expressionPath)
              .closest(j.ClassDeclaration)
              .map(nodePath => nodePath.get('body').get('body'));
      const methodsDefinition = classDefinition.children(j.MethodDefinition).paths()
              .concat(classDefinition.children(j.ClassProperty).filter(nodePath => {
                const node = nodePath.get('value').value;
                return j.ArrowFunctionExpression.check(node) ||
                  j.FunctionExpression.check(node);
              }).paths());
      return methodsDefinition.filter(propertyPath => {
        return propertyPath.get('key').get('name').value ===
          getMethodName(expressionPath);
      }).map(nodePath => nodePath.get('value'));
    })
    .forEach(replaceGregorianCalendarAPIToMoment);

  return ast.toSource();
};
