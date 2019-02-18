'use strict';

exports.isTimeRelatedComponent = function isTimeRelatedComponent(componentName) {
  return [
    'DatePicker', 'TimePicker',
    'Calendar', 'MonthPicker',
    // 'RangePicker' ignore RangePicker now
  ].indexOf(componentName) > -1;
};

exports.getNameFieldValue = function getNameFieldValue(nodePath) {
  return nodePath.get('name').get('name').value;
};

const hasOwn =
  Object.prototype.hasOwnProperty.call.bind(Object.prototype.hasOwnProperty);

function isNode(value) {
  return typeof value === 'object' && value;
}

exports.matchNode = function matchNode(haystack, needle) {
  if (typeof needle === 'function') {
    return needle(haystack);
  }
  if (isNode(needle) && isNode(haystack)) {
    return Object.keys(needle).every(function(property) {
      return (
        hasOwn(haystack, property) &&
        matchNode(haystack[property], needle[property])
      );
    });
  }
  return haystack === needle;
};
