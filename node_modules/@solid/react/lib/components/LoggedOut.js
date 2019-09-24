"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = LoggedOut;

var _useLoggedOut = _interopRequireDefault(require("../hooks/useLoggedOut"));

/** Pane that only shows its contents when the user is logged out. */
function LoggedOut({
  children = null
}) {
  const loggedOut = (0, _useLoggedOut.default)();
  return loggedOut ? children : null;
}