'use strict';

const getExtension = require('./getJscodeshiftExtension');
const utils = require('./utils');

function oldFormatToNewFormat(format) {
  return format.split('').map(c => {
    if (c === 'y') {
      return 'Y';
    } else if (c === 'd') {
      return 'D';
    }
    return c;
  }).join('');
}

function getDefaultFormat(componentName) {
  if (componentName === 'MonthPicker') {
    return 'YYYY-MM';
  } else if (componentName === 'TimePicker') {
    return 'HH:mm:ss';
  }
  return 'YYYY-MM-DD';
}

function getComponentNameFromAttr(j, attr) {
  return j(attr).closest(j.JSXOpeningElement).nodes()[0].name.name;
}

module.exports = function(file, api) {
  const j = api.jscodeshift;
  j.registerMethods(getExtension(j));
  const ast = j(file.source);
  const template = j.template;

  const timeRelatedOpeningElementsAttrs = ast.find(j.JSXOpeningElement)
          .filter(nodePath => utils.isTimeRelatedComponent(utils.getNameFieldValue(nodePath)))
          .map(nodePath => nodePath.get('attributes'));

  // update `format` to moment format
  timeRelatedOpeningElementsAttrs
    .children(j.JSXAttribute, {
      name: {
        type: 'JSXIdentifier',
        name: 'format',
      },
    })
    .forEach(formatAttr => {
      const $formatAttr = j(formatAttr);
      const $formatLiteral = $formatAttr.find(j.Literal);
      if ($formatLiteral.size() > 0) {
        $formatLiteral.replaceWith(nodePath => j.literal(oldFormatToNewFormat(nodePath.value.value)));
        return;
      }
      $formatAttr.getVariableDeclarators(nodePath => {
        const formatVariable = nodePath.value.value.expression;
        return formatVariable.name;
      }).forEach(declarator => {
        j(declarator.get('init')).replaceWith(nodePath => j.literal(oldFormatToNewFormat(nodePath.value.value)));
      });
    });

  let hadUsedMoment = false;
  // update `value` || `defaultValue` to moment object
  timeRelatedOpeningElementsAttrs
    .children(j.JSXAttribute, nodePath => {
      const attrName = nodePath.name.name;
      return attrName === 'value' || attrName === 'defaultValue';
    })
    .forEach(attrToModify => {
      const $attrToModify = j(attrToModify);
      const formatAttr = $attrToModify.siblings(j.JSXAttribute, {
        name: {
          type: 'JSXIdentifier',
          name: 'format',
        },
      });
      const formatAttrPath = formatAttr.nodes()[0];
      const formatValue = formatAttr.find(j.Literal).nodes()[0] ||
              formatAttrPath && formatAttrPath.value.expression ||
              j.identifier(JSON.stringify(getDefaultFormat(getComponentNameFromAttr(j, attrToModify))));

      j(attrToModify.get('value'))
        .forEach(nodePath => {
          const $valueToBeReplaced = j.JSXExpressionContainer.check(nodePath.value) &&
                  j.ArrayExpression.check(nodePath.value.expression) ?
                  j(nodePath.get('expression').get('elements')) : j(nodePath);

          $valueToBeReplaced.replaceWith(({ value }) => {
            function wrapInMoment(extractedValue) {
              hadUsedMoment = true;
              const attrValue = j.Literal.check(extractedValue) ? extractedValue : extractedValue.expression;
              return j.callExpression(j.identifier('moment'), [ attrValue, formatValue ]);
            }
            return j.jsxExpressionContainer(wrapInMoment(value));
          });
        });
    });

  if (hadUsedMoment) {
    // make sure that `import moment from 'moment'` exist
    const importMomentStatement = ast.find(j.ImportDeclaration, {
      source: {
        type: 'Literal',
        value: 'moment',
      },
    });
    if (importMomentStatement.size() === 0) {
      const statement = template.statement`import moment from 'moment';\n`;
      ast.find(j.Program).get('body').get(0)
        .insertBefore(statement);
    }
  }

  return ast.toSource();
};
