"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _propTypes = require("prop-types");

var _LoggedIn = _interopRequireDefault(require("./components/LoggedIn"));

var _LoginButton = _interopRequireDefault(require("./components/LoginButton"));

var _AuthButton = _interopRequireDefault(require("./components/AuthButton"));

var _Value = _interopRequireDefault(require("./components/Value"));

var _Image = _interopRequireDefault(require("./components/Image"));

var _Link = _interopRequireDefault(require("./components/Link"));

var _Label = _interopRequireDefault(require("./components/Label"));

var _Name = _interopRequireDefault(require("./components/Name"));

var _List = _interopRequireDefault(require("./components/List"));

var _LiveUpdate = _interopRequireDefault(require("./components/LiveUpdate"));

const ldflexExpression = (0, _propTypes.oneOfType)([_propTypes.string, _propTypes.object]);
const numberString = (0, _propTypes.oneOfType)([_propTypes.number, _propTypes.string]);
const children = (0, _propTypes.oneOfType)([_propTypes.array, _propTypes.string, _propTypes.element]);
const needsChildren = {
  children: children.isRequired
};
const srcAndChildren = {
  src: ldflexExpression.isRequired,
  children
};

function setPropTypes(Component, ...propTypes) {
  Component.propTypes = Object.assign({}, ...propTypes);
}

setPropTypes(_LoggedIn.default, needsChildren);
setPropTypes(_LoggedIn.default, needsChildren);
setPropTypes(_LoginButton.default, {
  popup: _propTypes.string
});
setPropTypes(_AuthButton.default, _LoginButton.default.propTypes);
setPropTypes(_Value.default, srcAndChildren);
setPropTypes(_Image.default, srcAndChildren, {
  defaultSrc: _propTypes.string
});
setPropTypes(_Link.default, {
  href: ldflexExpression.isRequired,
  children
});
setPropTypes(_Label.default, srcAndChildren);
setPropTypes(_Name.default, srcAndChildren);
setPropTypes(_List.default, {
  src: ldflexExpression.isRequired,
  container: _propTypes.func,
  children: _propTypes.func,
  limit: numberString,
  offset: numberString,
  filter: _propTypes.func
});
setPropTypes(_LiveUpdate.default, {
  subscribe: (0, _propTypes.oneOfType)([_propTypes.array, _propTypes.string])
});