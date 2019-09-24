'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withToastManager = exports.ToastConsumer = exports.ToastProvider = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _ToastController = require('./ToastController');

var _ToastContainer = require('./ToastContainer');

var _ToastElement = require('./ToastElement');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultComponents = { Toast: _ToastElement.DefaultToast, ToastContainer: _ToastContainer.ToastContainer };

// $FlowFixMe
var _React$createContext = _react2.default.createContext(),
    Consumer = _React$createContext.Consumer,
    Provider = _React$createContext.Provider;

var NOOP = function NOOP() {};
var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

// Provider
// ==============================

var ToastProvider = exports.ToastProvider = function (_Component) {
  _inherits(ToastProvider, _Component);

  function ToastProvider(props) {
    _classCallCheck(this, ToastProvider);

    var _this = _possibleConstructorReturn(this, (ToastProvider.__proto__ || Object.getPrototypeOf(ToastProvider)).call(this, props));

    _this.cacheComponents = function (components) {
      _this.components = _extends({}, defaultComponents, components);
    };

    _this.add = function (content) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cb = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : NOOP;

      var id = (0, _utils.generateUEID)();
      var callback = function callback() {
        return cb(id);
      };

      _this.setState(function (state) {
        var toasts = state.toasts.slice(0);
        var toast = Object.assign({}, { content: content, id: id }, options);

        toasts.push(toast);

        return { toasts: toasts };
      }, callback);
    };

    _this.remove = function (id) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NOOP;

      var callback = function callback() {
        return cb(id);
      };

      _this.setState(function (state) {
        var toasts = state.toasts.filter(function (t) {
          return t.id !== id;
        });
        return { toasts: toasts };
      }, callback);
    };

    _this.onDismiss = function (id) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : NOOP;
      return function () {
        cb(id);
        _this.remove(id);
      };
    };

    _this.cacheComponents(props.components);
    _this.state = { toasts: [] };
    return _this;
  }

  _createClass(ToastProvider, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.components !== this.props.components) {
        this.cacheComponents(nextProps.components);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          children = _props.children,
          components = _props.components,
          props = _objectWithoutProperties(_props, ['children', 'components']);

      var _components = this.components,
          Toast = _components.Toast,
          ToastContainer = _components.ToastContainer;
      var toasts = this.state.toasts;
      var add = this.add,
          remove = this.remove;


      return _react2.default.createElement(
        Provider,
        { value: { add: add, remove: remove, toasts: toasts } },
        children,
        canUseDOM ? (0, _reactDom.createPortal)(_react2.default.createElement(
          ToastContainer,
          props,
          toasts.map(function (_ref) {
            var content = _ref.content,
                id = _ref.id,
                onDismiss = _ref.onDismiss,
                rest = _objectWithoutProperties(_ref, ['content', 'id', 'onDismiss']);

            return _react2.default.createElement(
              _ToastController.ToastController,
              _extends({
                key: id,
                Toast: Toast,
                onDismiss: _this2.onDismiss(id, onDismiss)
              }, props, rest),
              content
            );
          })
        ), document.body) : _react2.default.createElement(ToastContainer, props) // keep ReactDOM.hydrate happy

      );
    }
  }]);

  return ToastProvider;
}(_react.Component);

ToastProvider.defaultProps = {
  autoDismissTimeout: 5000,
  components: defaultComponents,
  placement: 'top-right',
  transitionDuration: 220
};
var ToastConsumer = exports.ToastConsumer = function ToastConsumer(_ref2) {
  var children = _ref2.children;
  return _react2.default.createElement(
    Consumer,
    null,
    function (context) {
      return children(context);
    }
  );
};

var withToastManager = exports.withToastManager = function withToastManager(Comp) {
  return function (props) {
    return _react2.default.createElement(
      ToastConsumer,
      null,
      function (context) {
        return _react2.default.createElement(Comp, _extends({ toastManager: context }, props));
      }
    );
  };
};