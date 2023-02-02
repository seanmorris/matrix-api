"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Matrix = void 0;

var _Uuid = require("curvature/base/Uuid");

var _Mixin = require("curvature/base/Mixin");

var _EventTargetMixin = require("curvature/mixin/EventTargetMixin");

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Matrix = function (_Mixin$with) {
  _inherits(Matrix, _Mixin$with);

  var _super = _createSuper(Matrix);

  function Matrix(baseUrl) {
    var _options$storage, _options$interval;

    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Matrix);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "ssoUuid", String(new _Uuid.Uuid()));

    _defineProperty(_assertThisInitialized(_this), "isLoggedIn", false);

    _defineProperty(_assertThisInitialized(_this), "loggingIn", null);

    _this.baseUrl = baseUrl || 'https://matrix.org/_matrix';
    _this.clientUrl = "".concat(_this.baseUrl, "/client/v3");
    _this.mediaUrl = "".concat(_this.baseUrl, "/media/v3");
    _this.profileCache = new Map();
    _this.mediaCache = new Map();
    _this.storage = (_options$storage = options.storage) !== null && _options$storage !== void 0 ? _options$storage : globalThis.sessionStorage;
    _this.interval = (_options$interval = options.interval) !== null && _options$interval !== void 0 ? _options$interval : false;
    return _this;
  }

  _createClass(Matrix, [{
    key: "isLoggedIn",
    get: function get() {
      if (this.isLoggedIn) {
        this.dispatchEvent(new CustomEvent('logged-in'));
      }

      var tokenJson = this.storage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);
      return this.storage.getItem('matrix:access-token');
    }
  }, {
    key: "initSso",
    value: function initSso(redirectUri) {
      var _this2 = this;

      var windowRef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

      if (this.storage.getItem('matrix:access-token')) {
        this.isLoggedIn = true;
        this.dispatchEvent(new CustomEvent('logged-in'));
        return;
      }

      var query = new URLSearchParams({
        redirectUrl: redirectUri
      });
      var path = "login/sso/redirect?".concat(query);
      var width = 400;
      var height = 600;
      var left = window.screenX + window.outerWidth / 2 + width / 2;
      var top = window.screenY + window.outerHeight / 2 - height / 2;
      var options = "width=".concat(width, ",height=").concat(height, ",screenX=").concat(left, ",screenY=").concat(top);
      var ssoPopup = windowRef.open("".concat(this.clientUrl, "/").concat(path), "matrix-login-".concat(this.ssoUuid), options);

      var ssoListener = function ssoListener(event) {
        if (event.origin !== location.origin) {
          return;
        }

        if (event.source === window) {
          return;
        }

        if (typeof event.data !== 'string') {
          return;
        }

        var request = JSON.parse(event.data);

        if (request.type !== 's.sso.complete') {
          return;
        }

        _this2.storage.setItem('matrix:access-token', JSON.stringify(request.data));

        _this2.isLoggedIn = true;

        _this2.dispatchEvent(new CustomEvent('logged-in'));

        windowRef.removeEventListener('message', ssoListener);
      };

      windowRef.addEventListener('message', ssoListener);
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
    key: "logIn",
    value: function logIn(redirectUri) {
      var _this3 = this;

      var windowRef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

      if (!this.loggingIn) {
        this.loggingIn = new Promise(function (accept) {
          _this3.loggingIn = null;

          _this3.addEventListener('logged-in', function (event) {
            accept(event);
          }, {
            once: true
          });
        });
      }

      this.initSso(redirectUri, windowRef);
      return this.loggingIn;
    }
  }, {
    key: "logOut",
    value: function logOut() {
      this.storage.removeItem('matrix:access-token');
      this.isLoggedIn = false;
      this.loggingIn = null;
      this.dispatchEvent(new CustomEvent('logged-out'));
    }
  }, {
    key: "getGuestToken",
    value: function getGuestToken() {
      var _this4 = this;

      var tokenJson = this.storage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (token && token.isGuest) {
        return Promise.resolve(token);
      }

      var query = new URLSearchParams({
        kind: 'guest'
      });
      var getToken = fetch("".concat(this.clientUrl, "/register?").concat(query), {
        method: 'POST',
        body: '{}'
      }).then(function (response) {
        return response.json();
      });
      getToken.then(function (token) {
        token.isGuest = true;
        _this4.isLoggedIn = true;

        _this4.storage.setItem('matrix:access-token', JSON.stringify(token));
      });
      return getToken;
    }
  }, {
    key: "getToken",
    value: function getToken() {
      var tokenJson = this.storage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (token) {
        return Promise.resolve(token);
      }

      return matrix.getGuestToken();
    }
  }, {
    key: "listenForServerEvents",
    value: function listenForServerEvents() {
      var _this5 = this;

      var token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      var listener = "".concat(this.clientUrl, "/events?").concat(query);
      fetch(listener).then(function (response) {
        return response.json();
      }).then(function (response) {
        return _this5.streamServerEvents(response);
      });
    }
  }, {
    key: "listenForRoomEvents",
    value: function listenForRoomEvents(room_id, controller) {
      var _this6 = this;

      var from = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      if (controller && controller.cancelled) {
        return;
      }

      var token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var query = new URLSearchParams({
        access_token: token.access_token,
        room_id: room_id,
        from: from
      });
      var listener = "".concat(this.clientUrl, "/events?").concat(query);
      controller = controller || {
        cancelled: false
      };
      fetch(listener).then(function (response) {
        return response.json();
      }).then(function (response) {
        return _this6.streamServerEvents(response, room_id, controller);
      });
      return controller;
    }
  }, {
    key: "streamServerEvents",
    value: function streamServerEvents(chunkList, room_id, controller) {
      var _this7 = this;

      if (controller && controller.cancelled) {
        return;
      }

      if (!this.interval) {
        if (room_id) {
          this.listenForRoomEvents(room_id, controller, chunkList.end);
        } else {
          this.listenForServerEvents();
        }
      } else {
        setTimeout(function () {
          if (room_id) {
            _this7.listenForRoomEvents(room_id, controller, chunkList.end);
          } else {
            _this7.listenForServerEvents();
          }
        }, this.interval);
      }

      chunkList.chunk && chunkList.chunk.forEach(function (event) {
        var detail = {};

        if (!event.event_id) {
          event.event_id = "local:".concat(new _Uuid.Uuid());
        }

        Object.assign(detail, event);

        _this7.dispatchEvent(new CustomEvent('matrix-event', {
          detail: detail
        }));

        _this7.dispatchEvent(new CustomEvent(detail.type, {
          detail: detail
        }));
      });
    }
  }, {
    key: "getUserProfile",
    value: function getUserProfile(userId) {
      if (this.profileCache.has(userId)) {
        return this.profileCache.get(userId);
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
      var token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      return fetch("".concat(this.clientUrl, "/user/").concat(token.user_id, "/account_data/").concat(type, "?").concat(query)).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "putUserData",
    value: function putUserData(type, body) {
      var token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return;
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      var endpoint = "".concat(this.clientUrl, "/user/").concat(token.user_id, "/account_data/").concat(type, "?").concat(query);
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
      var tokenJson = this.storage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return;
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      var url = "".concat(this.mediaUrl, "/upload?").concat(query);
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
      var tokenJson = this.storage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return;
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      var url = "".concat(this.clientUrl, "/rooms/").concat(roomId, "/send/").concat(type, "/").concat(Math.random().toString(36), "?").concat(query);
      var headers = new Headers({
        'Content-Type': 'application/json'
      });
      var method = 'PUT';
      var keepalive = true;

      var options = _defineProperty({
        method: method,
        headers: headers,
        keepalive: keepalive,
        body: JSON.stringify(body)
      }, "keepalive", keepalive);

      return fetch(url, options).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "getEvent",
    value: function getEvent(roomId, eventId) {
      var tokenJson = this.storage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return;
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      var url = "".concat(this.clientUrl, "/rooms/").concat(roomId, "/event/").concat(eventId, "?").concat(query);
      var headers = new Headers({
        'Content-Type': 'application/json'
      });
      var method = 'GET';
      var options = {
        method: method,
        headers: headers
      };
      return fetch(url, options).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "sync",
    value: function sync() {
      var tokenJson = this.storage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return Promise.resolve();
      }

      var query = new URLSearchParams({
        full_state: true,
        access_token: token.access_token
      });
      var syncer = "".concat(this.clientUrl, "/sync?").concat(query);
      return fetch(syncer).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "getRoomState",
    value: function getRoomState(room_id) {
      var tokenJson = this.storage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return Promise.resolve();
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      var syncer = "".concat(this.clientUrl, "/rooms/").concat(room_id, "/state?").concat(query);
      return fetch(syncer).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "syncRoom",
    value: function syncRoom(room_id) {
      var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (!this.isLoggedIn) {
        return Promise.reject('Logged out.');
      }

      var token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var query = new URLSearchParams({
        access_token: token.access_token,
        room_id: room_id,
        dir: 'b',
        from: from ? from : '',
        filter: filter ? JSON.stringify(filter) : ''
      });
      var syncer = "".concat(this.clientUrl, "/rooms/").concat(room_id, "/messages?").concat(query);
      var controller = new AbortController();
      var signal = controller.signal;

      var abort = function abort() {
        return controller.abort();
      };

      this.addEventListener('logged-out', abort, {
        once: true
      });
      var fetchFrame = fetch(syncer, {
        signal: signal
      }).then(function (response) {
        return response.json();
      });
      fetchFrame["finally"](this.removeEventListener('logged-out', abort));
      return fetchFrame;
    }
  }, {
    key: "syncRoomHistory",
    value: function syncRoomHistory(room) {
      var _this8 = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var to = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var from = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var filter = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      return this.syncRoom(room, from, filter).then(function (frame) {
        if (!_this8.isLoggedIn) {
          return Promise.reject('Logged out.');
        }

        var cancelable = true;
        var detail = {
          frame: frame
        };
        var event = new CustomEvent('roomSyncFrame', {
          detail: detail,
          cancelable: cancelable
        });

        if (!_this8.dispatchEvent(event)) {
          return;
        }

        if (callback && frame.chunk) {
          var _iterator = _createForOfIteratorHelper(frame.chunk),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var message = _step.value;

              if (!_this8.isLoggedIn) {
                return Promise.reject('Logged out.');
              }

              if (to && message.origin_server_ts <= to) {
                return Promise.resolve();
              }

              if (callback(message) === false) {
                return Promise.resolve();
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        return new Promise(function (accept) {
          var _this8$interval;

          return setTimeout(function () {
            return accept(frame.chunk.length && _this8.syncRoomHistory(room, callback, to, frame.end, filter));
          }, (_this8$interval = _this8.interval) !== null && _this8$interval !== void 0 ? _this8$interval : 0);
        });
      });
    }
  }, {
    key: "getCurrentUserId",
    value: function getCurrentUserId() {
      var tokenJson = this.storage.getItem('matrix:access-token') || 'false';
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
      var token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.resolve();
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      var url = "".concat(this.clientUrl, "/createRoom?").concat(query);
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
      var token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      fetch("".concat(this.clientUrl, "/rooms/").concat(room_id, "/join?").concat(query), {
        method: 'POST'
      }).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "leaveRoom",
    value: function leaveRoom(room_id) {
      var token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      fetch("".concat(this.clientUrl, "/rooms/").concat(room_id, "/leave?").concat(query), {
        method: 'POST'
      }).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "whoAmI",
    value: function whoAmI() {
      var token = JSON.parse(this.storage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      var query = new URLSearchParams({
        access_token: token.access_token
      });
      return fetch("".concat(this.clientUrl, "/account/whoami?").concat(query)).then(function (response) {
        return response.json();
      });
    }
  }]);

  return Matrix;
}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));

exports.Matrix = Matrix;
