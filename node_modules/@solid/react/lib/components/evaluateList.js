"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = EvaluateList;

var _evaluateExpressions = _interopRequireDefault(require("./evaluateExpressions"));

/**
 * Higher-order component that evaluates an LDflex list expression in a property
 * and passes its items to the wrapped component.
 */
function EvaluateList(propName, WrappedComponent) {
  return (0, _evaluateExpressions.default)([], [propName], WrappedComponent);
}