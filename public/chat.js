/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/chat.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/chat.js":
/*!*********************!*\
  !*** ./src/chat.js ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services */ "./src/services.js");

var appState = {
  pollId: null,
  isLoggedIn: false,
  usernames: [],
  messages: [],
  error: '',
  currentUser: ''
};
var errMsgs = {
  'network-error': 'There was a problem connecting to the network, try again',
  'bad-login': "Login cannot be empty or contain all whitespaces or contain 'dog'",
  'missing-uid': 'Please login to continue.',
  'invalid-uid': 'Please login to continue.',
  'empty-message': 'Message cannot be empty'
};

function renderLogin(show) {
  var loginElem = document.querySelector('.login');
  var logoutElem = document.querySelector('.logout');
  var displayUserElem = document.querySelector('.display-username');

  if (show) {
    loginElem.innerHTML = "\n     <input class=\"user-name\" type=\"text\" value=\"\" placeholder=\"Enter username\"/>\n     <button class=\"login-button\" type=\"button\">Login</button>";
    displayUserElem.innerHTML = "";
    logoutElem.innerHTML = "";
  } else {
    loginElem.innerHTML = "";
    displayUserElem.innerHTML = "<span> Hello ".concat(appState.currentUser, "</span>");
    logoutElem.innerHTML = "\n      <button class=\"logout-button\" type=\"button\">Logout</button>\n     ";
  }
}

function renderErrors(text) {
  document.querySelector('.status').innerHTML = "<span>".concat(text, "</span>");
}

function renderPage() {
  if (!appState.isLoggedIn) {
    renderMessages([]);
    renderUsernames([]);
  } else {
    renderMessages(appState.messages);
    renderUsernames(appState.usernames);
  }

  renderErrors(appState.error);
}

function poll(shouldPoll) {
  if (shouldPoll && !appState.pollId) {
    appState.pollId = setInterval(function () {
      Object(_services__WEBPACK_IMPORTED_MODULE_0__["fetchChatStatus"])().then(function (content) {
        appState.isLoggedIn = true;
        appState.usernames = content['usernames'];
        appState.messages = content['messages'];
        renderPage();
      })["catch"](function (err) {
        setAppState(err, false);
        clearTimeout(appState.pollId);
        appState.pollId = null;
        renderLogin(true);
        renderPage();
      });
    }, 3000);
  } // For when a user logs out:


  if (!shouldPoll && appState.pollId) {
    clearTimeout(appState.pollId);
    appState.pollId = null;
  }
}

var outgoingElem = document.querySelector('.outgoing');
outgoingElem.addEventListener('click', function (e) {
  if (!e.target.classList.contains('send-button')) {
    return;
  }

  var text = document.querySelector('.to-send').value;
  Object(_services__WEBPACK_IMPORTED_MODULE_0__["fetchAddMessage"])(text).then(function (messages) {
    document.querySelector('.to-send').value = '';
    renderMessages(messages);
    appState.error = '';
    renderErrors(appState.error);
  })["catch"](function (err) {
    appState.error = errMsgs[err['error']] || err['error'];
    renderErrors(appState.error);
  });
});
var loginElem = document.querySelector('.login');
loginElem.addEventListener('click', function (e) {
  if (!e.target.classList.contains('login-button')) {
    return;
  }

  var username = document.querySelector('.user-name').value;
  Object(_services__WEBPACK_IMPORTED_MODULE_0__["fetchLogin"])(username).then(function (content) {
    setAppState(content, true);
    poll(true);
    renderLogin(false);
    renderPage();
    renderOutgoing();
  })["catch"](function (err) {
    setAppState(err, false);
    renderLogin(true);
    renderPage();
    renderOutgoing();
  });
});
var logoutButtonElem = document.querySelector('.logout');
logoutButtonElem.addEventListener('click', function (e) {
  Object(_services__WEBPACK_IMPORTED_MODULE_0__["fetchLogout"])().then(function (content) {
    appState.isLoggedIn = false;
    appState.error = '';
    poll(false);
    renderLogin(true);
    renderPage();
    renderOutgoing();
    renderErrors(appState.error);
  })["catch"](function () {
    appState.error = 'logout-failed';
    renderPage();
  });
});

function renderUsernames(usernames) {
  var html = usernames.map(function (username) {
    return "<li>\n    <div class=\"user\">\n      <span class=\"username\">".concat(username, "</span>\n    </div>\n  </li>");
  }).join('');
  document.querySelector('.usernames').innerHTML = html;
}

function renderMessages(messages) {
  var messagesElem = document.querySelector('.messages');
  var html = messages.map(function (message) {
    return "<li class=\"message-row\">\n      <div class=\"message\">\n        <div class=\"meta-info\">\n           <div class=\"sender-info\">\n              <span>".concat(message.sender, "</span>\n           </div>\n           <div class=\"message-info\">\n              <span>").concat(message.timestamp, "</span>\n           </div>\n        </div>\n        <p class=\"message-text\">").concat(message.text, "</p>\n      </div>\n    </li>");
  }).join('');
  messagesElem.innerHTML = html;
}

function renderOutgoing() {
  var outgoingElem = document.querySelector('.outgoing');
  outgoingElem.innerHTML = "\n     <input class=\"to-send\" type=\"text\" value=\"\" required=\"true\" placeholder=\"Enter your text\"/>\n     <button class=\"send-button\" type=\"button\">Send</button>";
  var toSendElem = document.querySelector('.to-send');
  var sendButtonElem = document.querySelector('.send-button');
}

function setAppState(content, isLoggedIn) {
  if (isLoggedIn) {
    appState.isLoggedIn = true;
    appState.usernames = content['usernames'];
    appState.messages = content['messages'];
    appState.currentUser = content['currentUser'];
    appState.error = '';
  } else {
    appState.isLoggedIn = false;
    appState.usernames = [];
    appState.messages = [];
    appState.currentUser = '';
    appState.error = errMsgs[content['error']] || content['error'];
  }
} // on load


Object(_services__WEBPACK_IMPORTED_MODULE_0__["fetchChatStatus"])().then(function (content) {
  setAppState(content, true);
  renderLogin(false);
  renderPage();
  renderOutgoing();
  poll(true);
})["catch"](function (content) {
  setAppState(content, false);
  renderLogin(true);
  renderPage();
  renderOutgoing();
  poll(false);
  renderErrors('');
});

/***/ }),

/***/ "./src/services.js":
/*!*************************!*\
  !*** ./src/services.js ***!
  \*************************/
/*! exports provided: fetchLogin, fetchLogout, fetchChatStatus, fetchAddMessage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchLogin", function() { return fetchLogin; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchLogout", function() { return fetchLogout; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchChatStatus", function() { return fetchChatStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fetchAddMessage", function() { return fetchAddMessage; });
var fetchLogin = function fetchLogin(username) {
  return fetch('/session', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({
      username: username
    })
  })["catch"](function () {
    return Promise.reject({
      error: 'network-error'
    });
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (result) {
        return Promise.reject(result);
      });
    }

    return response.json();
  });
};
var fetchLogout = function fetchLogout() {
  return fetch('/session', {
    method: 'DELETE'
  })["catch"](function () {
    return Promise.reject({
      error: 'network-error'
    });
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (result) {
        return Promise.reject(result);
      });
    }

    return response.json();
  });
};
var fetchChatStatus = function fetchChatStatus() {
  return fetch('/chatStatus', {
    method: 'GET'
  })["catch"](function () {
    return Promise.reject({
      error: 'network-error'
    });
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (result) {
        return Promise.reject(result);
      });
    }

    return response.json();
  });
};
var fetchAddMessage = function fetchAddMessage(text) {
  return fetch('/messages', {
    method: 'POST',
    headers: new Headers({
      'content-type': 'application/json'
    }),
    body: JSON.stringify({
      text: text
    })
  })["catch"](function () {
    return Promise.reject({
      error: 'network-error'
    });
  }).then(function (response) {
    if (!response.ok) {
      return response.json().then(function (result) {
        return Promise.reject(result);
      });
    }

    return response.json();
  });
};

/***/ })

/******/ });
//# sourceMappingURL=chat.js.map