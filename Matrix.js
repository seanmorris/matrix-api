"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Matrix = void 0;

var _Mixin = require("curvature/base/Mixin");

var _EventTargetMixin = require("curvature/mixin/EventTargetMixin");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Matrix = function (_Mixin$with) {
  _inherits(Matrix, _Mixin$with);

  var _super = _createSuper(Matrix);

  function Matrix() {
    var _this;

    _classCallCheck(this, Matrix);

    _this = _super.call(this);
    _this.baseUrl = 'https://matrix.org/_matrix';
    _this.clientUrl = "".concat(_this.baseUrl, "/client/r0");
    _this.mediaUrl = "".concat(_this.baseUrl, "/media/r0");
    _this.mediaCache = new Map();
    _this.profileCache = new Map();
    return _this;
  }

  _createClass(Matrix, [{
    key: "initSso",
    value: function initSso(redirectUri) {
      var _this2 = this;

      var path = 'login/sso/redirect?redirectUrl=' + redirectUri;
      var ssoPopup = window.open("".concat(this.clientUrl, "/").concat(path));

      var ssoListener = function ssoListener(event) {
        if (event.origin !== location.origin) {
          return;
        }

        var request = JSON.parse(event.data);

        if (request.type !== 's.sso.complete') {
          return;
        }

        sessionStorage.setItem('matrix:access-token', JSON.stringify(request.data));

        _this2.dispatchEvent(new CustomEvent('login'));
      };

      window.addEventListener('message', ssoListener);
    }
  }, {
    key: "completeSso",
    value: function completeSso(loginToken) {
      var path = 'login';
      var body = {
        type: "m.login.token",
        token: loginToken,
        txn_id: (1 / Math.random()).toString(36)
      };
      fetch("".concat(this.clientUrl, "/").concat(path), {
        method: 'POST',
        body: JSON.stringify(body)
      }).then(function (response) {
        return response.json();
      }).then(function (response) {
        window.opener.postMessage(JSON.stringify({
          type: 's.sso.complete',
          data: response
        }), location.origin);
        window.close();
      });
    }
  }, {
    key: "getGuestToken",
    value: function getGuestToken() {
      var tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (token && token.isGuest) {
        return Promise.resolve(token);
      }

      var getToken = fetch("".concat(this.clientUrl, "/register?kind=guest"), {
        method: 'POST',
        body: '{}'
      }).then(function (response) {
        return response.json();
      });
      getToken.then(function (token) {
        token.isGuest = true;
        sessionStorage.setItem('matrix:access-token', JSON.stringify(token));
      });
      return getToken;
    }
  }, {
    key: "getToken",
    value: function getToken() {
      var tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (token) {
        return Promise.resolve(token);
      }

      return matrix.getGuestToken();
    }
  }, {
    key: "listenForServerEvents",
    value: function listenForServerEvents() {
      var _this3 = this;

      var token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var listener = "".concat(this.clientUrl, "/events?access_token=").concat(token.access_token);
      fetch(listener).then(function (response) {
        return response.json();
      }).then(function (response) {
        return _this3.streamServerEvents(response);
      });
    }
  }, {
    key: "listenForRoomEvents",
    value: function listenForRoomEvents(room_id, controller) {
      var _this4 = this;

      var from = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      if (controller && controller.cancelled) {
        return;
      }

      var token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var listener = "".concat(this.clientUrl, "/events?room_id=").concat(room_id, "&access_token=").concat(token.access_token, "&from=").concat(from);
      controller = controller || {
        cancelled: false
      };
      fetch(listener).then(function (response) {
        return response.json();
      }).then(function (response) {
        return _this4.streamServerEvents(response, room_id, controller);
      });
      return controller;
    }
  }, {
    key: "getUserProfile",
    value: function getUserProfile(userId) {
      if (this.profileCache.has(userId, getProfile)) {
        return this.profileCache.get(userId, getProfile);
      }

      var getProfile = fetch("".concat(this.clientUrl, "/profile/").concat(userId)).then(function (response) {
        return response.json();
      });
      this.profileCache.set(userId, getProfile);
      return getProfile;
    }
  }, {
    key: "getUserData",
    value: function getUserData(type) {
      var token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      return fetch("".concat(this.clientUrl, "/user/").concat(token.user_id, "/account_data/").concat(type, "?access_token=").concat(token.access_token)).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "putUserData",
    value: function putUserData(type, body) {
      var token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return;
      }

      var endpoint = "".concat(this.clientUrl, "/user/").concat(token.user_id, "/account_data/").concat(type, "?access_token=").concat(token.access_token);
      return fetch(endpoint, {
        method: 'PUT',
        body: body
      }).then(function (response) {
        if (!response.ok) {
          var error = new Error("HTTP status code: " + response.status);
          error.status = response.status;
          error.response = response;
          throw error;
        }

        return response;
      }).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "getMediaUrl",
    value: function getMediaUrl(mxcUrl) {
      var url = new URL(mxcUrl);
      return "".concat(this.mediaUrl, "/download/").concat(url.pathname.substr(2));
    }
  }, {
    key: "getMedia",
    value: function getMedia(mxcUrl) {
      if (this.mediaCache.has(mxcUrl)) {
        return this.mediaCache.get(mxcUrl);
      }

      var getUrl = fetch(this.getMediaUrl(mxcUrl)).then(function (response) {
        return Promise.all([response.arrayBuffer(), response.headers.get('Content-type')]);
      }).then(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            buffer = _ref2[0],
            type = _ref2[1];

        return URL.createObjectURL(new Blob([buffer], {
          type: type
        }));
      });
      this.mediaCache.set(mxcUrl, getUrl);
      return getUrl;
    }
  }, {
    key: "postMedia",
    value: function postMedia(body, filename) {
      var tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return;
      }

      var url = "".concat(this.mediaUrl, "/upload?access_token=").concat(token.access_token);
      var headers = new Headers({
        'Content-Type': body.type
      });
      var method = 'POST';
      var options = {
        method: method,
        headers: headers,
        body: body
      };
      return fetch(url, options).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "putEvent",
    value: function putEvent(roomId, type, body) {
      var tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return;
      }

      var url = "".concat(this.clientUrl, "/rooms/").concat(roomId, "/send/").concat(type, "/").concat(Math.random().toString(36), "?access_token=").concat(token.access_token);
      var headers = new Headers({
        'Content-Type': body.type
      });
      var method = 'PUT';
      var options = {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
      };
      return fetch(url, options).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "sync",
    value: function sync() {
      var tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return Promise.resolve();
      }

      var syncer = "".concat(this.clientUrl, "/sync?full_state=true&access_token=").concat(token.access_token);
      return fetch(syncer).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "getRoomState",
    value: function getRoomState(room_id) {
      var tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return Promise.resolve();
      }

      var syncer = "".concat(this.clientUrl, "/rooms/").concat(room_id, "/state?access_token=").concat(token.access_token);
      return fetch(syncer).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "syncRoom",
    value: function syncRoom(room_id) {
      var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      var token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var syncer = "".concat(this.clientUrl, "/rooms/").concat(room_id, "/messages?dir=b&room_id=").concat(room_id, "&access_token=").concat(token.access_token, "&from=").concat(from);
      return fetch(syncer).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "syncRoomHistory",
    value: function syncRoomHistory(room, from) {
      var _this5 = this;

      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.syncRoom(room, from).then(function (chunk) {
        chunk.chunk && callback && chunk.chunk.forEach(callback);
        return chunk.chunk.length && _this5.syncRoomHistory(room, chunk.end, callback);
      });
    }
  }, {
    key: "streamServerEvents",
    value: function streamServerEvents(chunkList, room_id, controller) {
      var _this6 = this;

      if (controller && controller.cancelled) {
        return;
      }

      if (room_id) {
        this.listenForRoomEvents(room_id, controller, chunkList.end);
      } else {
        this.listenForServerEvents();
      }

      chunkList.chunk && chunkList.chunk.forEach(function (event) {
        var detail = new MatrixEvent();

        if (!event.event_id) {
          event.event_id = 'local:' + (1 / Math.random()).toString(36);
        }

        detail.consume(event);

        _this6.dispatchEvent(new CustomEvent('matrix-event', {
          detail: detail
        }));

        _this6.dispatchEvent(new CustomEvent(detail.type, {
          detail: detail
        }));
      });
    }
  }, {
    key: "getCurrentUserId",
    value: function getCurrentUserId() {
      var tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return;
      }

      return token.user_id;
    }
  }, {
    key: "createRoom",
    value: function createRoom(name, topic, visibility) {
      var initial_state = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var body = JSON.stringify({
        name: name,
        topic: topic,
        visibility: visibility,
        initial_state: initial_state
      });
      var token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.resolve();
      }

      var url = "".concat(this.clientUrl, "/createRoom?access_token=").concat(token.access_token);
      var method = 'POST';
      return fetch(url, {
        body: body,
        method: method
      }).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "joinRoom",
    value: function joinRoom(room_id) {
      var token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      fetch("".concat(this.clientUrl, "/rooms/").concat(room_id, "/join?access_token=").concat(token.access_token), {
        method: 'POST'
      }).then(function (response) {
        return response.json();
      });
    }
  }]);

  return Matrix;
}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));

exports.Matrix = Matrix;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bindable = void 0;

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function F() {};

      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
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

var Ref = Symbol('ref');
var Original = Symbol('original');
var Deck = Symbol('deck');
var Binding = Symbol('binding');
var SubBinding = Symbol('subBinding');
var BindingAll = Symbol('bindingAll');
var IsBindable = Symbol('isBindable');
var Wrapping = Symbol('wrapping');
var Names = Symbol('Names');
var Executing = Symbol('executing');
var Stack = Symbol('stack');
var ObjSymbol = Symbol('object');
var Wrapped = Symbol('wrapped');
var Unwrapped = Symbol('unwrapped');
var GetProto = Symbol('getProto');
var OnGet = Symbol('onGet');
var OnAllGet = Symbol('onAllGet');
var BindChain = Symbol('bindChain');
var Descriptors = Symbol('Descriptors');
var NoGetters = Symbol('NoGetters');
var TypedArray = Object.getPrototypeOf(Int8Array);
var SetIterator = Set.prototype[Symbol.iterator];
var MapIterator = Map.prototype[Symbol.iterator];
var win = globalThis;
var excludedClasses = [win.Node, win.File, win.Map, win.Set, win.WeakMap, win.WeakSet, win.ArrayBuffer, win.ResizeObserver, win.MutationObserver, win.PerformanceObserver, win.IntersectionObserver].filter(function (x) {
  return typeof x === 'function';
});

var Bindable = function () {
  function Bindable() {
    _classCallCheck(this, Bindable);
  }

  _createClass(Bindable, null, [{
    key: "isBindable",
    value: function isBindable(object) {
      if (!object || !object[IsBindable]) {
        return false;
      }

      return object[IsBindable] === Bindable;
    }
  }, {
    key: "onDeck",
    value: function onDeck(object, key) {
      return object[Deck][key] || false;
    }
  }, {
    key: "ref",
    value: function ref(object) {
      return object[Ref] || object || false;
    }
  }, {
    key: "makeBindable",
    value: function makeBindable(object) {
      return this.make(object);
    }
  }, {
    key: "shuck",
    value: function shuck(original, seen) {
      seen = seen || new Map();
      var clone = {};

      if (original instanceof TypedArray || original instanceof ArrayBuffer) {
        var _clone = original.slice(0);

        seen.set(original, _clone);
        return _clone;
      }

      var properties = Object.keys(original);

      for (var i in properties) {
        var ii = properties[i];

        if (ii.substring(0, 3) === '___') {
          continue;
        }

        var alreadyCloned = seen.get(original[ii]);

        if (alreadyCloned) {
          clone[ii] = alreadyCloned;
          continue;
        }

        if (original[ii] === original) {
          seen.set(original[ii], clone);
          clone[ii] = clone;
          continue;
        }

        if (original[ii] && _typeof(original[ii]) === 'object') {
          var originalProp = original[ii];

          if (Bindable.isBindable(original[ii])) {
            originalProp = original[ii][Original];
          }

          clone[ii] = this.shuck(originalProp, seen);
        } else {
          clone[ii] = original[ii];
        }

        seen.set(original[ii], clone[ii]);
      }

      if (Bindable.isBindable(original)) {
        delete clone.bindTo;
        delete clone.isBound;
      }

      return clone;
    }
  }, {
    key: "make",
    value: function make(object) {
      var _this = this;

      if (!object || !['function', 'object'].includes(_typeof(object))) {
        return object;
      }

      if (excludedClasses.filter(function (x) {
        return object instanceof x;
      }).length || Object.isSealed(object) || !Object.isExtensible(object)) {
        return object;
      }

      if (object[Ref]) {
        return object[Ref];
      }

      if (object[Binding]) {
        return object;
      }

      Object.defineProperty(object, Ref, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: false
      });
      Object.defineProperty(object, Original, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: object
      });
      Object.defineProperty(object, Deck, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, Binding, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, SubBinding, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map()
      });
      Object.defineProperty(object, BindingAll, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, IsBindable, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Bindable
      });
      Object.defineProperty(object, Executing, {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, Wrapping, {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, Stack, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, '___before___', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, '___after___', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, Wrapped, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map()
      });
      Object.defineProperty(object, Unwrapped, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, Descriptors, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map()
      });

      var bindTo = function bindTo(property) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var bindToAll = false;

        if (Array.isArray(property)) {
          var debinders = property.map(function (p) {
            return bindTo(p, callback, options);
          });
          return function () {
            return debinders.map(function (d) {
              return d();
            });
          };
        }

        if (property instanceof Function) {
          options = callback || {};
          callback = property;
          bindToAll = true;
        }

        if (options.delay >= 0) {
          callback = _this.wrapDelayCallback(callback, options.delay);
        }

        if (options.throttle >= 0) {
          callback = _this.wrapThrottleCallback(callback, options.throttle);
        }

        if (options.wait >= 0) {
          callback = _this.wrapWaitCallback(callback, options.wait);
        }

        if (options.frame) {
          callback = _this.wrapFrameCallback(callback, options.frame);
        }

        if (options.idle) {
          callback = _this.wrapIdleCallback(callback);
        }

        if (bindToAll) {
          var bindIndex = object[BindingAll].length;
          object[BindingAll].push(callback);

          if (!('now' in options) || options.now) {
            for (var i in object) {
              callback(object[i], i, object, false);
            }
          }

          return function () {
            delete object[BindingAll][bindIndex];
          };
        }

        if (!object[Binding][property]) {
          object[Binding][property] = new Set();
        }

        if (options.children) {
          var original = callback;

          callback = function callback() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var v = args[0];
            var subDebind = object[SubBinding].get(original);

            if (subDebind) {
              object[SubBinding]["delete"](original);
              subDebind();
            }

            if (_typeof(v) !== 'object') {
              original.apply(void 0, args);
              return;
            }

            var vv = Bindable.make(v);

            if (Bindable.isBindable(vv)) {
              object[SubBinding].set(original, vv.bindTo(function () {
                for (var _len2 = arguments.length, subArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  subArgs[_key2] = arguments[_key2];
                }

                return original.apply(void 0, args.concat(subArgs));
              }, Object.assign({}, options, {
                children: false
              })));
            }

            original.apply(void 0, args);
          };
        }

        object[Binding][property].add(callback);

        if (!('now' in options) || options.now) {
          callback(object[property], property, object, false);
        }

        var debinder = function debinder() {
          var subDebind = object[SubBinding].get(callback);

          if (subDebind) {
            object[SubBinding]["delete"](callback);
            subDebind();
          }

          if (!object[Binding][property]) {
            return;
          }

          if (!object[Binding][property].has(callback)) {
            return;
          }

          object[Binding][property]["delete"](callback);
        };

        if (options.removeWith && options.removeWith instanceof View) {
          options.removeWith.onRemove(function () {
            return debinder;
          });
        }

        return debinder;
      };

      Object.defineProperty(object, 'bindTo', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: bindTo
      });

      var ___before = function ___before(callback) {
        var beforeIndex = object.___before___.length;

        object.___before___.push(callback);

        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }

          cleaned = true;
          delete object.___before___[beforeIndex];
        };
      };

      var ___after = function ___after(callback) {
        var afterIndex = object.___after___.length;

        object.___after___.push(callback);

        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }

          cleaned = true;
          delete object.___after___[afterIndex];
        };
      };

      Object.defineProperty(object, BindChain, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function value(path, callback) {
          var parts = path.split('.');
          var node = parts.shift();
          var subParts = parts.slice(0);
          var debind = [];
          debind.push(object.bindTo(node, function (v, k, t, d) {
            var rest = subParts.join('.');

            if (subParts.length === 0) {
              callback(v, k, t, d);
              return;
            }

            if (v === undefined) {
              v = t[k] = _this.makeBindable({});
            }

            debind = debind.concat(v[BindChain](rest, callback));
          }));
          return function () {
            return debind.map(function (x) {
              return x();
            });
          };
        }
      });
      Object.defineProperty(object, '___before', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: ___before
      });
      Object.defineProperty(object, '___after', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: ___after
      });

      var isBound = function isBound() {
        for (var i in object[BindingAll]) {
          if (object[BindingAll][i]) {
            return true;
          }
        }

        for (var _i in object[Binding]) {
          for (var j in object[Binding][_i]) {
            if (object[Binding][_i][j]) {
              return true;
            }
          }
        }

        return false;
      };

      Object.defineProperty(object, 'isBound', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: isBound
      });

      if (!object[NoGetters]) {
        var _loop = function _loop(i) {
          if (object[i] && object[i] instanceof Object && !object[i] instanceof Promise) {
            if (!excludedClasses.filter(function (excludeClass) {
              return object[i] instanceof excludeClass;
            }).length && Object.isExtensible(object[i]) && !Object.isSealed(object[i])) {
              object[i] = Bindable.make(object[i]);
            }
          }
        };

        for (var i in object) {
          _loop(i);
        }
      }

      var set = function set(target, key, value) {
        if (key === Original) {
          return true;
        }

        if (object[Deck][key] !== undefined && object[Deck][key] === value) {
          return true;
        }

        if (typeof key === 'string' && key.substring(0, 3) === '___' && key.slice(-3) === '___') {
          return true;
        }

        if (target[key] === value) {
          return true;
        }

        if (value && value instanceof Object) {
          if (!excludedClasses.filter(function (x) {
            return object instanceof x;
          }).length && Object.isExtensible(object) && !Object.isSealed(object)) {
            if (!object[NoGetters]) {
              value = Bindable.makeBindable(value);
            }
          }
        }

        object[Deck][key] = value;

        for (var _i2 in object[BindingAll]) {
          if (!object[BindingAll][_i2]) {
            continue;
          }

          object[BindingAll][_i2](value, key, target, false);
        }

        var stop = false;

        if (key in object[Binding]) {
          var _iterator = _createForOfIteratorHelper(object[Binding][key]),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var callback = _step.value;

              if (callback(value, key, target, false, target[key]) === false) {
                stop = true;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        delete object[Deck][key];

        if (!stop) {
          var descriptor = Object.getOwnPropertyDescriptor(target, key);
          var excluded = target instanceof File && key == 'lastModifiedDate';

          if (!excluded && (!descriptor || descriptor.writable) && target[key] === value) {
            target[key] = value;
          }
        }

        var result = Reflect.set(target, key, value);

        if (Array.isArray(target) && object[Binding]['length']) {
          for (var _i3 in object[Binding]['length']) {
            var _callback = object[Binding]['length'][_i3];

            _callback(target.length, 'length', target, false, target.length);
          }
        }

        return result;
      };

      var deleteProperty = function deleteProperty(target, key) {
        if (!(key in target)) {
          return true;
        }

        if (descriptors.has(key)) {
          var descriptor = descriptors.get(key);

          if (descriptor && !descriptor.configurable) {
            return false;
          }

          descriptors["delete"](key);
        }

        for (var _i4 in object[BindingAll]) {
          object[BindingAll][_i4](undefined, key, target, true, target[key]);
        }

        if (key in object[Binding]) {
          for (var _i5 in object[Binding][key]) {
            if (!object[Binding][key][_i5]) {
              continue;
            }

            object[Binding][key][_i5](undefined, key, target, true, target[key]);
          }
        }

        delete target[key];
        return true;
      };

      var construct = function construct(target, args) {
        var key = 'constructor';

        for (var _i6 in target.___before___) {
          target.___before___[_i6](target, key, object[Stack], undefined, args);
        }

        var instance = Bindable.make(_construct(target[Original], _toConsumableArray(args)));

        for (var _i7 in target.___after___) {
          target.___after___[_i7](target, key, object[Stack], instance, args);
        }

        return instance;
      };

      var descriptors = object[Descriptors];
      var wrapped = object[Wrapped];
      var stack = object[Stack];

      var get = function get(target, key) {
        if (wrapped.has(key)) {
          return wrapped.get(key);
        }

        if (key === Ref || key === Original || key === 'apply' || key === 'isBound' || key === 'bindTo' || key === '__proto__' || key === 'constructor') {
          return object[key];
        }

        var descriptor;

        if (descriptors.has(key)) {
          descriptor = descriptors.get(key);
        } else {
          descriptor = Object.getOwnPropertyDescriptor(object, key);
          descriptors.set(key, descriptor);
        }

        if (descriptor && !descriptor.configurable && !descriptor.writable) {
          return object[key];
        }

        if (OnAllGet in object) {
          return object[OnAllGet](key);
        }

        if (OnGet in object && !(key in object)) {
          return object[OnGet](key);
        }

        if (descriptor && !descriptor.configurable && !descriptor.writable) {
          wrapped.set(key, object[key]);
          return object[key];
        }

        if (typeof object[key] === 'function') {
          if (Names in object[key]) {
            return object[key];
          }

          Object.defineProperty(object[Unwrapped], key, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: object[key]
          });
          var prototype = Object.getPrototypeOf(object);
          var isMethod = prototype[key] === object[key];
          var objRef = typeof Promise === 'function' && object instanceof Promise || typeof Map === 'function' && object instanceof Map || typeof Set === 'function' && object instanceof Set || typeof MapIterator === 'function' && object.prototype === MapIterator || typeof SetIterator === 'function' && object.prototype === SetIterator || typeof SetIterator === 'function' && object.prototype === SetIterator || typeof WeakMap === 'function' && object instanceof WeakMap || typeof WeakSet === 'function' && object instanceof WeakSet || typeof Date === 'function' && object instanceof Date || typeof TypedArray === 'function' && object instanceof TypedArray || typeof ArrayBuffer === 'function' && object instanceof ArrayBuffer || typeof EventTarget === 'function' && object instanceof EventTarget || typeof ResizeObserver === 'function' && object instanceof ResizeObserver || typeof MutationObserver === 'function' && object instanceof MutationObserver || typeof PerformanceObserver === 'function' && object instanceof PerformanceObserver || typeof IntersectionObserver === 'function' && object instanceof IntersectionObserver || typeof object[Symbol.iterator] === 'function' && key === 'next' ? object : object[Ref];

          var wrappedMethod = function wrappedMethod() {
            object[Executing] = key;
            stack.unshift(key);

            for (var _len3 = arguments.length, providedArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              providedArgs[_key3] = arguments[_key3];
            }

            var _iterator2 = _createForOfIteratorHelper(object.___before___),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var beforeCallback = _step2.value;
                beforeCallback(object, key, stack, object, providedArgs);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }

            var ret;

            if (new.target) {
              ret = _construct(object[Unwrapped][key], providedArgs);
            } else {
              var func = object[Unwrapped][key];

              if (isMethod) {
                ret = func.apply(objRef || object, providedArgs);
              } else {
                ret = func.apply(void 0, providedArgs);
              }
            }

            var _iterator3 = _createForOfIteratorHelper(object.___after___),
                _step3;

            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var afterCallback = _step3.value;
                afterCallback(object, key, stack, object, providedArgs);
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }

            object[Executing] = null;
            stack.shift();
            return ret;
          };

          wrappedMethod[Names] = wrappedMethod[Names] || new WeakMap();
          wrappedMethod[Names].set(object, key);

          wrappedMethod[OnAllGet] = function (key) {
            var selfName = wrappedMethod[Names].get(object);
            return object[selfName][key];
          };

          var result = Bindable.make(wrappedMethod);
          wrapped.set(key, result);
          return result;
        }

        return object[key];
      };

      var getPrototypeOf = function getPrototypeOf(target) {
        if (GetProto in object) {
          return object[GetProto];
        }

        return Reflect.getPrototypeOf(target);
      };

      var handler = {
        get: get,
        set: set,
        construct: construct,
        getPrototypeOf: getPrototypeOf,
        deleteProperty: deleteProperty
      };

      if (object[NoGetters]) {
        delete handler.get;
      }

      Object.defineProperty(object, Ref, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Proxy(object, handler)
      });
      return object[Ref];
    }
  }, {
    key: "clearBindings",
    value: function clearBindings(object) {
      var clearObj = function clearObj(o) {
        return Object.keys(o).map(function (k) {
          return delete o[k];
        });
      };

      var maps = function maps(func) {
        return function () {
          for (var _len4 = arguments.length, os = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            os[_key4] = arguments[_key4];
          }

          return os.map(func);
        };
      };

      var clearObjs = maps(clearObj);
      clearObjs(object[Wrapped], object[Binding], object[BindingAll], object.___after___, object.___before___);
    }
  }, {
    key: "resolve",
    value: function resolve(object, path) {
      var owner = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var node;
      var pathParts = path.split('.');
      var top = pathParts[0];

      while (pathParts.length) {
        if (owner && pathParts.length === 1) {
          var obj = object.NoGetters ? this.make(object) : object;
          return [obj, pathParts.shift(), top];
        }

        node = pathParts.shift();

        if (!node in object || !object[node] || !(object[node] instanceof Object)) {
          object[node] = {};
        }

        object = object.NoGetters ? this.make(object[node]) : object[node];
      }

      return [this.make(object), node, top];
    }
  }, {
    key: "wrapDelayCallback",
    value: function wrapDelayCallback(callback, delay) {
      return function () {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        return setTimeout(function () {
          return callback.apply(void 0, args);
        }, delay);
      };
    }
  }, {
    key: "wrapThrottleCallback",
    value: function wrapThrottleCallback(callback, throttle) {
      var _this2 = this;

      this.throttles.set(callback, false);
      return function () {
        if (_this2.throttles.get(callback, true)) {
          return;
        }

        callback.apply(void 0, arguments);

        _this2.throttles.set(callback, true);

        setTimeout(function () {
          _this2.throttles.set(callback, false);
        }, throttle);
      };
    }
  }, {
    key: "wrapWaitCallback",
    value: function wrapWaitCallback(callback, wait) {
      var _this3 = this;

      return function () {
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }

        var waiter;

        if (waiter = _this3.waiters.get(callback)) {
          _this3.waiters["delete"](callback);

          clearTimeout(waiter);
        }

        waiter = setTimeout(function () {
          return callback.apply(void 0, args);
        }, wait);

        _this3.waiters.set(callback, waiter);
      };
    }
  }, {
    key: "wrapFrameCallback",
    value: function wrapFrameCallback(callback, frames) {
      return function () {
        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }

        requestAnimationFrame(function () {
          return callback.apply(void 0, args);
        });
      };
    }
  }, {
    key: "wrapIdleCallback",
    value: function wrapIdleCallback(callback) {
      return function () {
        for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
          args[_key8] = arguments[_key8];
        }

        var req = window.requestIdleCallback || requestAnimationFrame;
        req(function () {
          return callback.apply(void 0, args);
        });
      };
    }
  }]);

  return Bindable;
}();

exports.Bindable = Bindable;

_defineProperty(Bindable, "waiters", new WeakMap());

_defineProperty(Bindable, "throttles", new WeakMap());

Object.defineProperty(Bindable, 'OnGet', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: OnGet
});
Object.defineProperty(Bindable, 'NoGetters', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: NoGetters
});
Object.defineProperty(Bindable, 'GetProto', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: GetProto
});
Object.defineProperty(Bindable, 'OnAllGet', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: OnAllGet
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mixin = void 0;

var _Bindable = require("./Bindable");

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function F() {};

      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function s() {
      it = o[Symbol.iterator]();
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var Constructor = Symbol('constructor');
var MixinList = Symbol('mixinList');

var Mixin = function () {
  function Mixin() {
    _classCallCheck(this, Mixin);
  }

  _createClass(Mixin, null, [{
    key: "from",
    value: function from(baseClass) {
      for (var _len = arguments.length, mixins = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        mixins[_key - 1] = arguments[_key];
      }

      var constructors = [];

      var newClass = function (_baseClass) {
        _inherits(newClass, _baseClass);

        var _super = _createSuper(newClass);

        function newClass() {
          var _this;

          _classCallCheck(this, newClass);

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          var instance = _this = _super.call.apply(_super, [this].concat(args));

          var _iterator = _createForOfIteratorHelper(mixins),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var mixin = _step.value;

              if (mixin[Mixin.Constructor]) {
                mixin[Mixin.Constructor].apply(_assertThisInitialized(_this));
              }

              switch (_typeof(mixin)) {
                case 'object':
                  Mixin.mixObject(mixin, _assertThisInitialized(_this));
                  break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          return _possibleConstructorReturn(_this, instance);
        }

        return newClass;
      }(baseClass);

      return newClass;
    }
  }, {
    key: "to",
    value: function to(base) {
      var descriptors = {};

      for (var _len3 = arguments.length, mixins = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        mixins[_key3 - 1] = arguments[_key3];
      }

      mixins.map(function (mixin) {
        switch (_typeof(mixin)) {
          case 'object':
            Object.assign(descriptors, Object.getOwnPropertyDescriptors(mixin));
            break;

          case 'function':
            Object.assign(descriptors, Object.getOwnPropertyDescriptors(mixin.prototype));
            break;
        }

        delete descriptors.constructor;
        Object.defineProperties(base.prototype, descriptors);
      });
    }
  }, {
    key: "with",
    value: function _with() {
      for (var _len4 = arguments.length, mixins = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        mixins[_key4] = arguments[_key4];
      }

      return this.from.apply(this, [Object].concat(mixins));
    }
  }, {
    key: "mixObject",
    value: function mixObject(mixin, instance) {
      var _iterator2 = _createForOfIteratorHelper(Object.getOwnPropertyNames(mixin)),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var func = _step2.value;

          if (typeof mixin[func] === 'function') {
            instance[func] = mixin[func].bind(instance);
            continue;
          }

          instance[func] = mixin[func];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      var _iterator3 = _createForOfIteratorHelper(Object.getOwnPropertySymbols(mixin)),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _func = _step3.value;

          if (typeof mixin[_func] === 'function') {
            instance[_func] = mixin[_func].bind(instance);
            continue;
          }

          instance[_func] = mixin[_func];
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "mixClass",
    value: function mixClass(cls, newClass) {
      var _iterator4 = _createForOfIteratorHelper(Object.getOwnPropertyNames(cls.prototype)),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var func = _step4.value;
          newClass.prototype[func] = cls.prototype[func].bind(newClass.prototype);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      var _iterator5 = _createForOfIteratorHelper(Object.getOwnPropertySymbols(cls.prototype)),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _func2 = _step5.value;
          newClass.prototype[_func2] = cls.prototype[_func2].bind(newClass.prototype);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      var _iterator6 = _createForOfIteratorHelper(Object.getOwnPropertyNames(cls)),
          _step6;

      try {
        var _loop = function _loop() {
          var func = _step6.value;

          if (typeof cls[func] !== 'function') {
            return "continue";
          }

          var prev = newClass[func] || false;
          var meth = cls[func].bind(newClass);

          newClass[func] = function () {
            prev && prev.apply(void 0, arguments);
            return meth.apply(void 0, arguments);
          };
        };

        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _ret = _loop();

          if (_ret === "continue") continue;
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      var _iterator7 = _createForOfIteratorHelper(Object.getOwnPropertySymbols(cls)),
          _step7;

      try {
        var _loop2 = function _loop2() {
          var func = _step7.value;

          if (typeof cls[func] !== 'function') {
            return "continue";
          }

          var prev = newClass[func] || false;
          var meth = cls[func].bind(newClass);

          newClass[func] = function () {
            prev && prev.apply(void 0, arguments);
            return meth.apply(void 0, arguments);
          };
        };

        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var _ret2 = _loop2();

          if (_ret2 === "continue") continue;
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "mix",
    value: function mix(mixinTo) {
      var constructors = [];
      var allStatic = {};
      var allInstance = {};

      var mixable = _Bindable.Bindable.makeBindable(mixinTo);

      var _loop3 = function _loop3(base) {
        var instanceNames = Object.getOwnPropertyNames(base.prototype);
        var staticNames = Object.getOwnPropertyNames(base);
        var prefix = /^(before|after)__(.+)/;

        var _iterator8 = _createForOfIteratorHelper(staticNames),
            _step8;

        try {
          var _loop5 = function _loop5() {
            var methodName = _step8.value;
            var match = methodName.match(prefix);

            if (match) {
              switch (match[1]) {
                case 'before':
                  mixable.___before(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }

                    var method = base[methodName].bind(o);
                    return method.apply(void 0, _toConsumableArray(a));
                  });

                  break;

                case 'after':
                  mixable.___after(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }

                    var method = base[methodName].bind(o);
                    return method.apply(void 0, _toConsumableArray(a));
                  });

                  break;
              }

              return "continue";
            }

            if (allStatic[methodName]) {
              return "continue";
            }

            if (typeof base[methodName] !== 'function') {
              return "continue";
            }

            allStatic[methodName] = base[methodName];
          };

          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var _ret3 = _loop5();

            if (_ret3 === "continue") continue;
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }

        var _iterator9 = _createForOfIteratorHelper(instanceNames),
            _step9;

        try {
          var _loop6 = function _loop6() {
            var methodName = _step9.value;
            var match = methodName.match(prefix);

            if (match) {
              switch (match[1]) {
                case 'before':
                  mixable.___before(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }

                    var method = base.prototype[methodName].bind(o);
                    return method.apply(void 0, _toConsumableArray(a));
                  });

                  break;

                case 'after':
                  mixable.___after(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }

                    var method = base.prototype[methodName].bind(o);
                    return method.apply(void 0, _toConsumableArray(a));
                  });

                  break;
              }

              return "continue";
            }

            if (allInstance[methodName]) {
              return "continue";
            }

            if (typeof base.prototype[methodName] !== 'function') {
              return "continue";
            }

            allInstance[methodName] = base.prototype[methodName];
          };

          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var _ret4 = _loop6();

            if (_ret4 === "continue") continue;
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      };

      for (var base = this; base && base.prototype; base = Object.getPrototypeOf(base)) {
        _loop3(base);
      }

      for (var methodName in allStatic) {
        mixinTo[methodName] = allStatic[methodName].bind(mixinTo);
      }

      var _loop4 = function _loop4(_methodName) {
        mixinTo.prototype[_methodName] = function () {
          for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }

          return allInstance[_methodName].apply(this, args);
        };
      };

      for (var _methodName in allInstance) {
        _loop4(_methodName);
      }

      return mixable;
    }
  }]);

  return Mixin;
}();

exports.Mixin = Mixin;
Mixin.Constructor = Constructor;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventTargetMixin = void 0;

var _Mixin = require("../base/Mixin");

var _EventTargetMixin;

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

var _EventTarget = Symbol('Target');

var EventTargetMixin = (_EventTargetMixin = {}, _defineProperty(_EventTargetMixin, _Mixin.Mixin.Constructor, function () {
  try {
    this[_EventTarget] = new EventTarget();
  } catch (error) {
    this[_EventTarget] = document.createDocumentFragment();
  }
}), _defineProperty(_EventTargetMixin, "dispatchEvent", function dispatchEvent() {
  var _this$_EventTarget;

  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var event = args[0];

  (_this$_EventTarget = this[_EventTarget]).dispatchEvent.apply(_this$_EventTarget, args);

  var defaultHandler = "on".concat(event.type[0].toUpperCase() + event.type.slice(1));

  if (typeof this[defaultHandler] === 'function') {
    this[defaultHandler](event);
  }

  return event.returnValue;
}), _defineProperty(_EventTargetMixin, "addEventListener", function addEventListener() {
  var _this$_EventTarget2;

  (_this$_EventTarget2 = this[_EventTarget]).addEventListener.apply(_this$_EventTarget2, arguments);
}), _defineProperty(_EventTargetMixin, "removeEventListener", function removeEventListener() {
  var _this$_EventTarget3;

  (_this$_EventTarget3 = this[_EventTarget]).removeEventListener.apply(_this$_EventTarget3, arguments);
}), _EventTargetMixin);
exports.EventTargetMixin = EventTargetMixin;
