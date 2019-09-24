"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = useLoggedIn;

var _react = require("react");

var _useWebId = _interopRequireDefault(require("./useWebId"));

const isNotNull = (_, id) => id === undefined ? undefined : id !== null;
/**
 * Returns whether the user is logged in,
 * or `undefined` if the user state is pending.
 */


function useLoggedIn() {
  const loggedIn = (0, _useWebId.default)(isNotNull);
  (0, _react.useDebugValue)(loggedIn);
  return loggedIn;
}