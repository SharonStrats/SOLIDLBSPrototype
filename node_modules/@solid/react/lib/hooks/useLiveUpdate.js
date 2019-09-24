"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = useLiveUpdate;

var _react = require("react");

var _UpdateContext = _interopRequireDefault(require("../UpdateContext"));

/**
 * Hook that rerenders components inside of a <LiveUpdate> container
 * whenever an update happens to one of the subscribed resources.
 *
 * This is a shortcut for using UpdateContext as a context,
 * and returns the latest update as `{ timestamp, url }`.
 */
function useLiveUpdate() {
  const latestUpdate = (0, _react.useContext)(_UpdateContext.default);
  (0, _react.useDebugValue)(latestUpdate.timestamp || null);
  return latestUpdate;
}