import _objectSpread from "@babel/runtime/helpers/objectSpread";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React from 'react';
import { useTranslation } from './useTranslation';
import { getDisplayName } from './utils';
export function withTranslation(ns) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function Extend(WrappedComponent) {
    function I18nextWithTranslation(props, ref) {
      var _useTranslation = useTranslation(ns, props),
          _useTranslation2 = _slicedToArray(_useTranslation, 3),
          t = _useTranslation2[0],
          i18n = _useTranslation2[1],
          ready = _useTranslation2[2];

      var passDownProps = _objectSpread({}, props, {
        t: t,
        i18n: i18n,
        tReady: ready
      });

      if (options.withRef && ref) {
        passDownProps.ref = ref;
      }

      return React.createElement(WrappedComponent, passDownProps);
    }

    I18nextWithTranslation.displayName = "withI18nextTranslation(".concat(getDisplayName(WrappedComponent), ")");
    I18nextWithTranslation.WrappedComponent = WrappedComponent;
    return options.withRef ? React.forwardRef(I18nextWithTranslation) : I18nextWithTranslation;
  };
}