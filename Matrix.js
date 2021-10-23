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

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Matrix = function (_Mixin$with) {
  _inherits(Matrix, _Mixin$with);

  var _super = _createSuper(Matrix);

  function Matrix(baseUrl) {
    var _this;

    _classCallCheck(this, Matrix);

    _this = _super.call(this);
    _this.baseUrl = baseUrl || 'https://matrix.org/_matrix';
    _this.clientUrl = "".concat(_this.baseUrl, "/client/r0");
    _this.mediaUrl = "".concat(_this.baseUrl, "/media/r0");
    _this.profileCache = new Map();
    _this.mediaCache = new Map();
    return _this;
  }

  _createClass(Matrix, [{
    key: "isLoggedIn",
    get: function get() {
      if (sessionStorage.getItem('matrix:access-token')) {
        this.dispatchEvent(new CustomEvent('logged-in'));
      }

      var tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);
      return sessionStorage.getItem('matrix:access-token');
    }
  }, {
    key: "initSso",
    value: function initSso(redirectUri) {
      var _this2 = this;

      var windowRef = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;
      var path = 'login/sso/redirect?redirectUrl=' + redirectUri;
      var width = 400;
      var height = 600;
      var left = window.screenX + window.outerWidth / 2 + width / 2;
      var top = window.screenY + window.outerHeight / 2 - height / 2;
      var options = "width=".concat(width, ",height=").concat(height, ",screenX=").concat(left, ",screenY=").concat(top);
      var ssoPopup = windowRef.open("".concat(this.clientUrl, "/").concat(path), 'matrix-login', options);

      var ssoListener = function ssoListener(event) {
        if (event.origin !== location.origin) {
          return;
        }

        var request = JSON.parse(event.data);

        if (request.type !== 's.sso.complete') {
          return;
        }

        sessionStorage.setItem('matrix:access-token', JSON.stringify(request.data));

        _this2.dispatchEvent(new CustomEvent('logged-in'));
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
        'Content-Type': 'application/json'
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
    key: "getEvent",
    value: function getEvent(roomId, eventId) {
      var tokenJson = sessionStorage.getItem('matrix:access-token') || 'false';
      var token = JSON.parse(tokenJson);

      if (!token) {
        return;
      }

      var url = "".concat(this.clientUrl, "/rooms/").concat(roomId, "/event/").concat(eventId, "?access_token=").concat(token.access_token);
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
  }, {
    key: "leaveRoom",
    value: function leaveRoom(room_id) {
      var token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      fetch("".concat(this.clientUrl, "/rooms/").concat(room_id, "/leave?access_token=").concat(token.access_token), {
        method: 'POST'
      }).then(function (response) {
        return response.json();
      });
    }
  }, {
    key: "whoAmI",
    value: function whoAmI() {
      var token = JSON.parse(sessionStorage.getItem('matrix:access-token') || 'false');

      if (!token) {
        return Promise.reject('No access token found.');
      }

      return fetch("".concat(this.clientUrl, "/account/whoami?access_token=").concat(token.access_token)).then(function (response) {
        return response.json();
      });
    }
  }]);

  return Matrix;
}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));

exports.Matrix = Matrix;
