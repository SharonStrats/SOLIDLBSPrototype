"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = useLoggedOut;

var _react = require("react");

var _useWebId = _interopRequireDefault(require("./useWebId"));

const isNull = (_, id) => id === undefined ? undefined : id === null;
/**
 * Returns whether the user is logged out,
 * or `undefined` if the user state is pending.
 */


function useLoggedOut() {
  const loggedOut = (0, _useWebId.default)(isNull);
  (0, _react.useDebugValue)(loggedOut);
  return loggedOut;
}