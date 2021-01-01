"use strict";

function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withTalk;

var _lodash = _interopRequireDefault(require("lodash"));

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _slicedToArray(arr, i) {
  return (
    _arrayWithHoles(arr) ||
    _iterableToArrayLimit(arr, i) ||
    _unsupportedIterableToArray(arr, i) ||
    _nonIterableRest()
  );
}

function _nonIterableRest() {
  throw new TypeError(
    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
  );
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr)))
    return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (
      var _i = arr[Symbol.iterator](), _s;
      !(_n = (_s = _i.next()).done);
      _n = true
    ) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function withTalk(Talk, hocInfos) {
  return function () {
    var makeState = function makeState(infos) {
      var state = {
        beforeReady: null
      };
      infos.forEach(function (_ref) {
        var name = _ref.name,
          loader = _ref.loader,
          before = _ref.before,
          success = _ref.success,
          error = _ref.error;
        var resolvers = {
          confirm: null,
          deny: null
        };
        var confirm = new Promise(function (res, rej) {
          return (resolvers.confirm = res);
        });
        var deny = new Promise(function (res, rej) {
          return (resolvers.deny = res);
        });
        state[name] = {
          data: null,
          errors: null,
          loader: {
            component: function component() {
              return null;
            },
            props: {},
            show: false
          },
          success: {
            component: function component() {
              return null;
            },
            props: {},
            show: false
          },
          error: {
            component: function component() {
              return null;
            },
            props: {},
            show: false
          },
          before: {
            component: function component() {
              return null;
            },
            props: {},
            show: false,
            resolvers: resolvers,
            confirm: confirm,
            deny: deny,
            confirmFn: function confirmFn() {
              return null;
            },
            denyFn: function denyFn() {
              return null;
            }
          }
        };
      });
      return state;
    };

    var INIT_STATE = makeState(hocInfos);

    var _useState = (0, _react.useState)(INIT_STATE),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

    var setComponentProps = function setComponentProps(
      name,
      _props,
      component
    ) {
      setState(function (prev) {
        var newProps = {
          props: function props() {
            return _props;
          }
        };

        var newState = _defineProperty(
          { ...prev },
          name,
          _defineProperty({ ...prev[name] }, component, {
            ...prev[name][component],
            props: { ...prev[name][component].props, ..._props }
          })
        );

        return newState;
      });
    };

    var setSuccessProps = function setSuccessProps(name, p) {
      return setComponentProps(name, p, "success");
    };

    var setErrorProps = function setErrorProps(name, p) {
      return setComponentProps(name, p, "error");
    };

    var setLoaderProps = function setLoaderProps(name, p) {
      return setComponentProps(name, p, "loader");
    };

    var setBeforeProps = function setBeforeProps(name, p) {
      return setComponentProps(name, p, "before");
    };

    var shouldShowComponent = function shouldShowComponent(component) {
      if (component.render === null || component.render === undefined) {
        return true;
      }

      return component.render;
    };

    var performAction = async function performAction(_ref2, data) {
      var name = _ref2.name,
        loader = _ref2.loader,
        before = _ref2.before,
        action = _ref2.action,
        success = _ref2.success,
        error = _ref2.error;

      if (!_lodash.default.isEmpty(loader)) {
        setState(function (prev) {
          return _defineProperty({ ...prev }, name, {
            ...prev[name],
            loader: {
              ...prev[name].loader,
              component: loader.component,
              props: {
                ...loader.props(
                  function (props) {
                    return setLoaderProps(name, props);
                  },
                  prev[name].data,
                  prev[name].errors
                )
              },
              show: shouldShowComponent(loader)
            }
          });
        });
      }

      try {
        var response = await action(data);

        if (
          !_lodash.default.isEmpty(loader) ||
          !_lodash.default.isEmpty(success)
        ) {
          setState(function (prev) {
            return _defineProperty({ ...prev }, name, {
              ...prev[name],
              data: response,
              loader: { ...prev[name].loader, props: {} },
              success: {
                ...prev[name].success,
                show: shouldShowComponent(success),
                component: success.component,
                props: {
                  ...success.props(
                    function (props) {
                      return setSuccessProps(name, props);
                    },
                    response,
                    prev[name].errors
                  )
                }
              }
            });
          });
        }
      } catch (err) {
        console.log("err is", err);

        if (
          !_lodash.default.isEmpty(loader) ||
          !_lodash.default.isEmpty(error)
        ) {
          setState(function (prev) {
            return _defineProperty({ ...prev }, name, {
              ...prev[name],
              errors: err,
              loader: { ...prev[name].loader, props: {} },
              error: {
                ...prev[name].error,
                show: shouldShowComponent(error),
                component: error.component,
                props: {
                  ...error.props(
                    function (props) {
                      return setErrorProps(name, props);
                    },
                    prev[name].data,
                    err
                  )
                }
              }
            });
          });
        }
      }
    };

    var initBeforeState = function initBeforeState(_ref6) {
      var name = _ref6.name,
        before = _ref6.before,
        data = _ref6.data;
      var resolvers = {
        confirm: null,
        deny: null
      };
      var confirm = new Promise(function (res, rej) {
        return (resolvers.confirm = res);
      });
      var deny = new Promise(function (res, rej) {
        return (resolvers.deny = res);
      });

      var confirmFn = function confirmFn() {
        setState(function (prev) {
          prev[name].before.resolvers.confirm("Action Confirmed!");
          return _defineProperty({ ...prev }, name, {
            ...prev[name],
            before: { ...prev[name].before, show: false }
          });
        });
      };

      var denyFn = function denyFn() {
        setState(function (prev) {
          prev[name].before.resolvers.deny("Action Denied!");
          return _defineProperty({ ...prev }, name, {
            ...prev[name],
            before: { ...prev[name].before, show: false }
          });
        });
      };

      setState(function (prev) {
        return _defineProperty(
          {
            ...prev,
            beforeReady: _defineProperty({}, name, {
              ready: true,
              data: data
            })
          },
          name,
          {
            ...prev[name],
            before: {
              ...prev[name].before,
              component: before.component,
              props: {
                ...before.props(
                  function (props) {
                    return setBeforeProps(name, props);
                  },
                  prev[name].data,
                  prev[name].errors
                ),
                confirmFn: confirmFn,
                denyFn: denyFn
              },
              resolvers: resolvers,
              confirm: confirm,
              deny: deny,
              confirmFn: confirmFn,
              denyFn: denyFn,
              show: false
            }
          }
        );
      });
    };

    var performBeforeAction = async function performBeforeAction(_ref10) {
      var name = _ref10.name,
        before = _ref10.before;
      setState(function (prev) {
        return _defineProperty({ ...prev }, name, {
          ...prev[name],
          before: { ...prev[name].before, show: shouldShowComponent(before) }
        });
      });
    };

    var fnInfo = {};
    hocInfos.forEach(function (_ref12) {
      var name = _ref12.name,
        loader = _ref12.loader,
        before = _ref12.before,
        action = _ref12.action,
        success = _ref12.success,
        error = _ref12.error;

      fnInfo[name] = async function (data) {
        if (_lodash.default.isEmpty(before)) {
          performAction(
            {
              name: name,
              loader: loader,
              before: before,
              action: action,
              success: success,
              error: error
            },
            data
          );
        } else {
          initBeforeState({
            name: name,
            before: before,
            data: data
          });
        }
      };
    });
    var data = {};
    var errors = {};
    var components = {};
    Object.keys(state)
      .filter(function (k) {
        return k !== "beforeReady";
      })
      .forEach(function (n) {
        data[n] = state[n].data;
        errors[n] = state[n].errors;
        components[n] = {
          before: {},
          loader: {},
          success: {},
          error: {}
        };
        components[n].before = _lodash.default.pick(state[n].before, [
          "component",
          "props"
        ]);
        components[n].loader = _lodash.default.pick(state[n].loader, [
          "component",
          "props"
        ]);
        components[n].success = _lodash.default.pick(state[n].success, [
          "component",
          "props"
        ]);
        components[n].error = _lodash.default.pick(state[n].error, [
          "component",
          "props"
        ]);
      });
    (0, _react.useEffect)(
      function () {
        hocInfos.forEach(function (_ref13) {
          var name = _ref13.name,
            loader = _ref13.loader,
            before = _ref13.before,
            action = _ref13.action,
            success = _ref13.success,
            error = _ref13.error;

          if (
            state.beforeReady &&
            state.beforeReady[name] &&
            state.beforeReady[name].ready
          ) {
            performBeforeAction({
              name: name,
              before: before
            });
            state[name].before.confirm.then(function (d) {
              var data = state.beforeReady[name].data;
              console.log("Performing action on data", data);
              performAction(
                {
                  name: name,
                  loader: loader,
                  before: before,
                  action: action,
                  success: success,
                  error: error
                },
                data
              );
            });
            state[name].before.deny.then(function (d) {
              return console.log(d);
            });
          }
        });
      },
      [state.beforeReady]
    );
    return /*#__PURE__*/ _react.default.createElement(
      _react.default.Fragment,
      null,
      Object.keys(state)
        .filter(function (k) {
          return k !== "beforeReady";
        })
        .map(function (name, i) {
          var BeforeComponent = state[name].before.component;
          var beforeProps = state[name].before.props;
          var LoaderComponent = state[name].loader.component;
          var loaderProps = state[name].loader.props;
          var SuccessComponent = state[name].success.component;
          var successProps = state[name].success.props;
          var ErrorComponent = state[name].error.component;
          var errorProps = state[name].error.props;
          return /*#__PURE__*/ _react.default.createElement(
            _react.default.Fragment,
            {
              key: i
            },
            state[name].before.show &&
              /*#__PURE__*/ _react.default.createElement(
                BeforeComponent,
                beforeProps
              ),
            state[name].loader.show &&
              /*#__PURE__*/ _react.default.createElement(
                LoaderComponent,
                loaderProps
              ),
            state[name].success.show &&
              /*#__PURE__*/ _react.default.createElement(
                SuccessComponent,
                successProps
              ),
            state[name].error.show &&
              /*#__PURE__*/ _react.default.createElement(
                ErrorComponent,
                errorProps
              )
          );
        }),
      /*#__PURE__*/ _react.default.createElement(Talk, {
        fnInfo: fnInfo,
        data: data,
        components: { ...components },
        errors: errors
      })
    );
  };
}
