(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _bind = require("../utils/bind");

(0, _bind.bind)(document, 'click', '[data-flip]', function (ev) {
  var el = ev.target;
  var card = el.closest('[data-card]');
  card.classList.toggle('active');

  if (el.hasAttribute('data-flip')) {
    ev.preventDefault();
  }
});

},{"../utils/bind":8}],2:[function(require,module,exports){
"use strict";

var _find = require("../utils/find");

var cover = function cover(el) {
  var url = el.getAttribute('data-cover');
  el.removeAttribute('data-cover');
  el.style.backgroundImage = "url(".concat(url, ")");
  el.style.backgroundSize = 'cover';
  el.style.backgroundPosition = 'center center';
};

if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(function (entries) {
    entries.filter(function (item) {
      return item.isIntersecting;
    }).forEach(function (item) {
      cover(item.target);
      observer.unobserve(item.target);
    });
  });
  (0, _find.find)('[data-cover]').forEach(function (el) {
    observer.observe(el);
  });
} else {
  (0, _find.find)('[data-cover]').forEach(cover);
}

},{"../utils/find":10}],3:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var isFunction = function isFunction(v) {
  return typeof v === 'function';
};

var hasProp = function hasProp(o, v) {
  return o && o.hasOwnProperty(v);
};

var stringFormat = function stringFormat(value, params, regexp) {
  regexp = regexp || /{{(.+?)}}/g;
  return value.replace(regexp, function (match, prop) {
    prop = prop.trim();

    if (isFunction(params)) {
      return params(prop) || match;
    } else {
      return (0, _typeof2["default"])(prop) in params ? params[prop] : match;
    }
  });
};

var getPath = function getPath(path, context) {
  var props = path.trim().split('.');
  var root = context || window;
  var first = props.shift();
  var value = null;

  if (hasProp(root, first)) {
    value = root[first];
    props.forEach(function (name) {
      value = hasProp(value, name) ? value[name] : null;
    });
  }

  return value;
};

var createElement = function createElement(name) {
  var attr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var element = document.createElement(name);
  Object.entries(attr).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        name = _ref2[0],
        value = _ref2[1];

    element.setAttribute(name, value);
  });
  return element;
};

var parseUrl = function parseUrl(value) {
  var link = createElement('a', {
    href: value
  });
  var origin = link.origin,
      hostname = link.hostname,
      href = link.href,
      host = link.host,
      pathname = link.pathname,
      search = link.search,
      hash = link.hash;
  return {
    origin: origin,
    hostname: hostname,
    pathname: pathname,
    href: href,
    hash: hash,
    host: host,
    search: search,
    query: parseQuery(search),
    path: pathname.split('/').filter(function (i) {
      return i;
    })
  };
};

var parseQuery = function parseQuery(search) {
  var params = {};

  if (search.charAt(0) === '?') {
    search = search.slice(1);
  }

  if (search === '') {
    return params;
  }

  search.split('&').forEach(function (chunk) {
    var _chunk$split = chunk.split('='),
        _chunk$split2 = (0, _slicedToArray2["default"])(_chunk$split, 2),
        name = _chunk$split2[0],
        value = _chunk$split2[1];

    if (value === undefined) {
      if (name) {
        value = true;
      } else {
        return;
      }
    }

    name = decodeURIComponent(name).trim();
    value = decodeURIComponent(value).trim();
    params[name] = value;
  });
  return params;
};

var scripts = [];

var arrayFind = function arrayFind(array, callback) {
  return array.filter(callback).shift();
};

var getScript = function getScript(endpoint) {
  if (endpoint in scripts) {
    return scripts[endpoint];
  }

  scripts[endpoint] = new Promise(function (resolve, reject) {
    var script = createElement('script', {
      async: true,
      src: endpoint
    });
    script.addEventListener('load', resolve);
    script.addEventListener('error', reject);
    document.body.appendChild(script);
  });
  return scripts[endpoint];
};

var getJsonCallback = function getJsonCallback(endpoint, params) {};

var providers = [];

var EmbedProvider = /*#__PURE__*/function () {
  function EmbedProvider(element, config, params) {
    (0, _classCallCheck2["default"])(this, EmbedProvider);
    this.element = element;
    this.config = config;
    this.params = params;
    this.render();
  }

  (0, _createClass2["default"])(EmbedProvider, [{
    key: "format",
    value: function format(string) {
      var _this = this;

      return stringFormat(string, function (prop) {
        return getPath(prop, _this);
      });
    }
  }, {
    key: "scope",
    value: function scope(namespace) {
      return getPath(namespace);
    }
  }, {
    key: "endpoint",
    value: function endpoint() {
      var url = this.config.endpoint;
      return url ? getScript(this.format(url)) : Promise.resolve();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      this.modify();
      this.template();
      this.endpoint().then(function () {
        _this2.callback();
      });
    }
  }, {
    key: "modify",
    value: function modify() {
      this.url = this.params.href;

      if (isFunction(this.config.modify)) {
        this.url = this.config.modify.call(this, this.params);
      }
    }
  }, {
    key: "template",
    value: function template() {
      this.html = '';

      if (isFunction(this.config.template)) {
        this.html = this.format(this.config.template.call(this));
      }

      this.element.innerHTML = this.html;
    }
  }, {
    key: "callback",
    value: function callback() {
      if (isFunction(this.config.callback)) {
        this.config.callback.call(this);
      }
    }
  }]);
  return EmbedProvider;
}();

providers.push({
  name: 'youtube',
  hosts: ['www.youtube.com', 'youtu.be'],
  modify: function modify(params) {
    var _params$path = (0, _slicedToArray2["default"])(params.path, 2),
        pathId = _params$path[1];

    var queryId = params.query.v;
    var id = pathId || queryId || false;
    return id ? "//www.youtube.com/embed/".concat(id, "?wmode=transparent") : false;
  },
  template: function template() {
    return "<iframe src=\"{{ url }}\"\n                    loading=\"lazy\" \n                    allowfullscreen>\n                </iframe>";
  }
});
providers.push({
  name: 'telegram',
  hosts: ['t.me'],
  endpoint: '//telegram.org/js/telegram-widget.js',
  modify: function modify(params) {
    var _params$path2 = (0, _slicedToArray2["default"])(params.path, 2),
        channel = _params$path2[0],
        post = _params$path2[1];

    return [channel, post].join('/');
  },
  template: function template() {
    return "<blockquote class=\"telegram-post\" \n                    data-width=\"100%\" \n                    data-telegram-post=\"{{ url }}\">\n                </blockquote>";
  }
});
providers.push({
  name: 'instagram',
  hosts: ['www.instagram.com', 'instagram.com', 'instagr.am'],
  endpoint: '//platform.instagram.com/{{ config.locale }}/embeds.js',
  locale: 'uk_UA',
  version: 14,
  template: function template() {
    return "<blockquote class=\"instagram-media\" \n                data-instgrm-captioned \n                data-instgrm-permalink=\"{{ url }}\" \n                data-instgrm-version=\"{{ config.version }}\">\n                </blockquote>";
  }
});
providers.push({
  name: 'facebook',
  hosts: ['www.facebook.com', 'facebook.com', 'fb.com'],
  endpoint: '//connect.facebook.net/{{ config.locale }}/sdk.js#xfbml=1&version=v14.0',
  locale: 'uk_UA',
  template: function template() {
    return "<div class=\"fb-post\" \n                data-show-text=\"true\" \n                data-width=\"auto\" \n                data-href=\"{{ url }}\">\n                </div>";
  },
  callback: function callback() {
    var sdk = this.scope('instgrm.Embeds');
    if (sdk) sdk.process();
  }
});
providers.push({
  name: 'twitter',
  hosts: ['twitter.com'],
  endpoint: '//platform.twitter.com/widgets.js',
  modify: function modify(params) {
    return params.href;
  },
  template: function template() {
    return "<blockquote class=\"twitter-tweet\">\n                <a href=\"{{ url }}\"></a>\n                </blockquote>";
  },
  callback: function callback() {
    var sdk = this.scope('twttr.widgets');
    if (sdk) sdk.load();
  }
});

var EmbedElement = /*#__PURE__*/function (_HTMLElement) {
  (0, _inherits2["default"])(EmbedElement, _HTMLElement);

  var _super = _createSuper(EmbedElement);

  function EmbedElement() {
    var _this3;

    (0, _classCallCheck2["default"])(this, EmbedElement);
    _this3 = _super.call(this);

    _this3.match();

    return _this3;
  }

  (0, _createClass2["default"])(EmbedElement, [{
    key: "match",
    value: function match() {
      var params = parseUrl(this.getAttribute('url'));
      var config = arrayFind(providers, function (config) {
        return config.hosts.indexOf(params.host) >= 0;
      });

      if (config) {
        new EmbedProvider(this, config, params);
      }
    }
  }]);
  return EmbedElement;
}( /*#__PURE__*/(0, _wrapNativeSuper2["default"])(HTMLElement));

var embedElements = function embedElements(selector, getUrl, getWrapper) {
  var list = [].slice.call(document.querySelectorAll(selector));
  list.forEach(function (el) {
    var url = getUrl(el);

    if (url) {
      var params = parseUrl(url);
      var config = arrayFind(providers, function (config) {
        return config.hosts.indexOf(params.host) >= 0;
      });

      if (config) {
        el = getWrapper(el);
        el.classList.add(config.name);
        new EmbedProvider(el, config, params);
      }
    }
  });
};

embedElements('p > a:only-child', function (el) {
  return el.getAttribute('href') || el.innerText;
}, function (el) {
  var parent = el.parentNode;
  var wrapper = document.createElement('figure');
  wrapper.classList.add('embed');
  parent.parentNode.replaceChild(wrapper, parent);
  return wrapper;
});

},{"@babel/runtime/helpers/classCallCheck":14,"@babel/runtime/helpers/createClass":16,"@babel/runtime/helpers/getPrototypeOf":17,"@babel/runtime/helpers/inherits":18,"@babel/runtime/helpers/interopRequireDefault":19,"@babel/runtime/helpers/possibleConstructorReturn":24,"@babel/runtime/helpers/slicedToArray":26,"@babel/runtime/helpers/typeof":27,"@babel/runtime/helpers/wrapNativeSuper":29}],4:[function(require,module,exports){
"use strict";

var _debounce = require("../utils/debounce");

var _bind = require("../utils/bind");

var regexp = new RegExp(/^#[^ ]+$/);

var getCssNumber = function getCssNumber(element, prop) {
  var value = null;

  if (element) {
    value = getComputedStyle(element)[prop];
  }

  return parseInt(value) || 0;
};

var position = function position(elem) {
  return elem.getBoundingClientRect();
};

var getOffset = function getOffset(elem) {
  var header = document.querySelector('.app-header');
  var previous = elem.previousElementSibling;
  return Math.round(header.offsetHeight) + (getCssNumber(previous, 'marginBottom') || 0);
};

var scroll = function scroll() {
  var offset, rect, elem, hash;
  hash = location.hash;
  elem = hash ? document.querySelector(hash) : null;

  if (elem) {
    rect = position(elem);
    offset = window.pageYOffset + Math.round(rect.top) - getOffset(elem);
    window.scrollTo({
      top: offset,
      left: window.scrollX,
      behavior: 'smooth'
    });
  }
};

var click = function click(ev) {
  if (ev.target.hash && ev.target.hash === location.hash) {
    ev.preventDefault();
  }
};

var match = function match() {
  var href = location.href,
      expr,
      attr;
  var list = document.querySelectorAll('a[href],[data-rel]');
  [].slice.call(list).filter(function (el) {
    el.classList.remove('active');
    expr = el.getAttribute('data-rel');
    attr = el.getAttribute('href');
    if (attr === '') return;
    if (attr === '#') return;
    return expr ? href.match(expr) : el.href ? href.indexOf(attr) !== -1 : false;
  }).map(function (el) {
    el.classList.add('active');
  });
};

var callback = (0, _debounce.debounce)(scroll);
(0, _bind.bind)(document, 'click', 'a', click);
window.addEventListener('hashchange', match, {
  passive: true
});
window.addEventListener('hashchange', callback, {
  passive: true
});
window.addEventListener('load', callback, {
  passive: true
});
match();

},{"../utils/bind":8,"../utils/debounce":9}],5:[function(require,module,exports){
"use strict";

var _debounce = require("../utils/debounce");

var html = document.documentElement;
var container = document.scrollingElement;
var scroll = 0;

var idle = function idle(cb, ttl) {
  clearTimeout(cb.idle);
  cb.idle = setTimeout(cb, ttl);
};

var scroller = function scroller() {
  var scrollTop = container.scrollTop;
  var progress = parseFloat(scrollTop / ((html.scrollHeight - html.clientHeight) / 100)).toFixed(2);
  idle(function () {
    html.style.setProperty('--progress', String(progress));
  }, 300);
  html.style.setProperty('--window-height', window.innerHeight + 'px');
  html.classList.toggle('scroll', scrollTop > 0);
  html.classList.toggle('scroll-bottom', scrollTop > 0 && scroll < scrollTop);
  html.classList.toggle('scroll-top', scrollTop > 0 && scroll > scrollTop);
  scroll = scrollTop;
};

var callback = (0, _debounce.debounce)(scroller);
window.addEventListener('orientationchange', callback, {
  passive: true
});
window.addEventListener('resize', callback, {
  passive: true
});
window.addEventListener('scroll', callback, {
  passive: true
});
scroller();

},{"../utils/debounce":9}],6:[function(require,module,exports){
"use strict";

var _bind = require("../utils/bind");

var _find = require("../utils/find");

var provider = {
  facebook: 'https://www.facebook.com/dialog/feed?app_id=2114681162110682&display=popup&link={link}',
  twitter: 'https://twitter.com/intent/tweet?text={text}&url={link}&via={via}&hashtags={hashtags}',
  linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url={link}',
  telegram: 'https://t.me/share/url?url={link}&text={text}',
  reddit: 'https://www.reddit.com/submit?url={link}&title={text}',
  pinterest: 'https://www.pinterest.com/pin/create/button/?url={link}&media={image}&description={text}',
  viber: 'viber://forward?text={link}',
  messenger: 'https://www.facebook.com/dialog/send?link={link}&app_id=2114681162110682&redirect_uri={link}'
};

var params = function params() {
  var meta = {};
  var data = {};
  var canonical = (0, _find.find)('link[rel="canonical"]')[0].getAttribute('href');
  (0, _find.find)('meta').forEach(function (e, i) {
    if (i = e.getAttribute('property') || e.getAttribute('name')) {
      meta[i] = e.getAttribute('content');
    }
  });
  data.text = encodeURIComponent(meta['og:description'] || meta['og:title'] || '');
  data.link = encodeURIComponent(canonical || meta['og:url']);
  data.image = meta['og:image'];

  if (meta['twitter:creator']) {
    data.via = String(meta['twitter:creator']).slice(1);
  } else {
    data.via = '';
  }

  if (meta['og:keywords']) {
    data.hashtags = meta['og:keywords'];
  } else {
    data.hashtags = '';
  }

  return data;
};

var format = function format(string, params) {
  return string.replace(/{(\w+)}/g, function (match, slot) {
    return typeof params[slot] != "undefined" ? params[slot] : match;
  });
};

var popup = function popup(url, params) {
  var idle = null;
  var width = 800;
  var height = 750;
  var template = 'scrollbars=0,resizable=0,menubar=0,toolbar=0,status=0,left={0},top={1},width={2},height={3}';
  var config = format(template, [screen.width / 2 - width / 2, screen.height / 2 - height / 2, width, height]);
  var popup = window.open(url, params.name || '', config);
  popup.focus();
  idle = setInterval(function () {
    if (popup.closed === true) {
      clearInterval(idle);

      if (typeof params.close == 'function') {
        params.close();
      }
    }
  }, 200);
};

(0, _bind.bind)(document, 'click', '[data-share]', function (ev) {
  ev.preventDefault();
  var elem = ev.target.closest('[data-share]');
  var type = elem.getAttribute('data-share');
  popup(format(provider[type], params()), {
    close: function close() {
      if (elem.getAttribute('data-reload')) {
        location.reload();
      }
    }
  });
});

},{"../utils/bind":8,"../utils/find":10}],7:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _smoothscrollPolyfill = _interopRequireDefault(require("smoothscroll-polyfill"));

require("./component/hashchange");

require("./component/scroll");

require("./component/card");

require("./component/share");

require("./component/cover");

require("./component/embed");

_smoothscrollPolyfill["default"].polyfill();

},{"./component/card":1,"./component/cover":2,"./component/embed":3,"./component/hashchange":4,"./component/scroll":5,"./component/share":6,"@babel/runtime/helpers/interopRequireDefault":19,"smoothscroll-polyfill":30}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bind = bind;

function bind(parent, event, selector, callback) {
  return parent.addEventListener(event, function (ev) {
    if (ev.target.matches(selector) || ev.target.closest(selector)) {
      var target = ev.target.matches(selector) ? ev.target : ev.target.closest(selector);
      callback.call(target, ev);
    }
  }, true);
}

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debounce = debounce;
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

function debounce(fn) {
  var frame, params;
  return function () {
    params = arguments;

    if (frame) {
      cancelAnimationFrame(frame);
    }

    frame = requestAnimationFrame(function () {
      fn.apply(null, params);
    });
  };
}

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;

/**
 *
 * @param selector
 * @param parent
 * @return {Element[]}
 */
function find(selector, parent) {
  return Array.from((parent || document).querySelectorAll(selector));
}

},{}],11:[function(require,module,exports){
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],12:[function(require,module,exports){
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],13:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],14:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],15:[function(require,module,exports){
var setPrototypeOf = require("./setPrototypeOf.js");

var isNativeReflectConstruct = require("./isNativeReflectConstruct.js");

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    module.exports = _construct = Reflect.construct;
    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _construct.apply(null, arguments);
}

module.exports = _construct;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./isNativeReflectConstruct.js":21,"./setPrototypeOf.js":25}],16:[function(require,module,exports){
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

module.exports = _createClass;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],17:[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  module.exports["default"] = module.exports, module.exports.__esModule = true;
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],18:[function(require,module,exports){
var setPrototypeOf = require("./setPrototypeOf.js");

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
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./setPrototypeOf.js":25}],19:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],20:[function(require,module,exports){
function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

module.exports = _isNativeFunction;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],21:[function(require,module,exports){
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

module.exports = _isNativeReflectConstruct;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],22:[function(require,module,exports){
function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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

module.exports = _iterableToArrayLimit;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],23:[function(require,module,exports){
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],24:[function(require,module,exports){
var _typeof = require("@babel/runtime/helpers/typeof")["default"];

var assertThisInitialized = require("./assertThisInitialized.js");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./assertThisInitialized.js":13,"@babel/runtime/helpers/typeof":27}],25:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  module.exports["default"] = module.exports, module.exports.__esModule = true;
  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],26:[function(require,module,exports){
var arrayWithHoles = require("./arrayWithHoles.js");

var iterableToArrayLimit = require("./iterableToArrayLimit.js");

var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");

var nonIterableRest = require("./nonIterableRest.js");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./arrayWithHoles.js":12,"./iterableToArrayLimit.js":22,"./nonIterableRest.js":23,"./unsupportedIterableToArray.js":28}],27:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    module.exports["default"] = module.exports, module.exports.__esModule = true;
  }

  return _typeof(obj);
}

module.exports = _typeof;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{}],28:[function(require,module,exports){
var arrayLikeToArray = require("./arrayLikeToArray.js");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./arrayLikeToArray.js":11}],29:[function(require,module,exports){
var getPrototypeOf = require("./getPrototypeOf.js");

var setPrototypeOf = require("./setPrototypeOf.js");

var isNativeFunction = require("./isNativeFunction.js");

var construct = require("./construct.js");

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return construct(Class, arguments, getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return setPrototypeOf(Wrapper, Class);
  };

  module.exports["default"] = module.exports, module.exports.__esModule = true;
  return _wrapNativeSuper(Class);
}

module.exports = _wrapNativeSuper;
module.exports["default"] = module.exports, module.exports.__esModule = true;
},{"./construct.js":15,"./getPrototypeOf.js":17,"./isNativeFunction.js":20,"./setPrototypeOf.js":25}],30:[function(require,module,exports){
/* smoothscroll v0.4.4 - 2019 - Dustan Kasten, Jeremias Menichelli - MIT License */
(function () {
  'use strict';

  // polyfill
  function polyfill() {
    // aliases
    var w = window;
    var d = document;

    // return if scroll behavior is supported and polyfill is not forced
    if (
      'scrollBehavior' in d.documentElement.style &&
      w.__forceSmoothScrollPolyfill__ !== true
    ) {
      return;
    }

    // globals
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    // object gathering original scroll methods
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      elementScroll: Element.prototype.scroll || scrollElement,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    // define timing method
    var now =
      w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;

    /**
     * indicates if a the current browser is made by Microsoft
     * @method isMicrosoftBrowser
     * @param {String} userAgent
     * @returns {Boolean}
     */
    function isMicrosoftBrowser(userAgent) {
      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }

    /*
     * IE has rounding bug rounding down clientHeight and clientWidth and
     * rounding up scrollHeight and scrollWidth causing false positives
     * on hasScrollableSpace
     */
    var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} firstArg
     * @returns {Boolean}
     */
    function shouldBailOut(firstArg) {
      if (
        firstArg === null ||
        typeof firstArg !== 'object' ||
        firstArg.behavior === undefined ||
        firstArg.behavior === 'auto' ||
        firstArg.behavior === 'instant'
      ) {
        // first argument is not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError(
        'behavior member of ScrollOptions ' +
          firstArg.behavior +
          ' is not a valid value for enumeration ScrollBehavior.'
      );
    }

    /**
     * indicates if an element has scrollable space in the provided axis
     * @method hasScrollableSpace
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function hasScrollableSpace(el, axis) {
      if (axis === 'Y') {
        return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
      }

      if (axis === 'X') {
        return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
      }
    }

    /**
     * indicates if an element has a scrollable overflow property in the axis
     * @method canOverflow
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function canOverflow(el, axis) {
      var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

      return overflowValue === 'auto' || overflowValue === 'scroll';
    }

    /**
     * indicates if an element can be scrolled in either axis
     * @method isScrollable
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function isScrollable(el) {
      var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
      var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

      return isScrollableY || isScrollableX;
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      while (el !== d.body && isScrollable(el) === false) {
        el = el.parentNode || el.host;
      }

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     * @returns {undefined}
     */
    function step(context) {
      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // scroll more if we have not reached our destination
      if (currentX !== context.x || currentY !== context.y) {
        w.requestAnimationFrame(step.bind(w, context));
      }
    }

    /**
     * scrolls window or element with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y
      });
    }

    // ORIGINAL METHODS OVERRIDES
    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scroll.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object'
              ? arguments[0]
              : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined
              ? arguments[1]
              : w.scrollY || w.pageYOffset
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        arguments[0].left !== undefined
          ? ~~arguments[0].left
          : w.scrollX || w.pageXOffset,
        arguments[0].top !== undefined
          ? ~~arguments[0].top
          : w.scrollY || w.pageYOffset
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object' ? arguments[0] : 0,
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined ? arguments[1] : 0
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scroll and Element.prototype.scrollTo
    Element.prototype.scroll = Element.prototype.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        // if one number is passed, throw error to match Firefox implementation
        if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
          throw new SyntaxError('Value could not be converted');
        }

        original.elementScroll.call(
          this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
        );

        return;
      }

      var left = arguments[0].left;
      var top = arguments[0].top;

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        this,
        this,
        typeof left === 'undefined' ? this.scrollLeft : ~~left,
        typeof top === 'undefined' ? this.scrollTop : ~~top
      );
    };

    // Element.prototype.scrollBy
    Element.prototype.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.elementScroll.call(
          this,
          arguments[0].left !== undefined
            ? ~~arguments[0].left + this.scrollLeft
            : ~~arguments[0] + this.scrollLeft,
          arguments[0].top !== undefined
            ? ~~arguments[0].top + this.scrollTop
            : ~~arguments[1] + this.scrollTop
        );

        return;
      }

      this.scroll({
        left: ~~arguments[0].left + this.scrollLeft,
        top: ~~arguments[0].top + this.scrollTop,
        behavior: arguments[0].behavior
      });
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scrollIntoView.call(
          this,
          arguments[0] === undefined ? true : arguments[0]
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );

        // reveal parent in viewport unless is fixed
        if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
          w.scrollBy({
            left: parentRects.left,
            top: parentRects.top,
            behavior: 'smooth'
          });
        }
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // commonjs
    module.exports = { polyfill: polyfill };
  } else {
    // global
    polyfill();
  }

}());

},{}]},{},[7])

