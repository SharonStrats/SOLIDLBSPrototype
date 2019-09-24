"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = LoggedIn;

var _useLoggedIn = _interopRequireDefault(require("../hooks/useLoggedIn"));

/** Pane that only shows its contents when the user is logged in. */
function LoggedIn({
  children = null
}) {
  const loggedIn = (0, _useLoggedIn.default)();
  return loggedIn ? children : null;
}