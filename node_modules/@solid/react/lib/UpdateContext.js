"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

/**
 * Context that tracks the latest updates to resources
 * and has its value set to `{ timestamp, url }`.
 */
var _default = _react.default.createContext({});

exports.default = _default;