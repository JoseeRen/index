/* 框架初始化 */
!function(win, $) {
var 
  yp = function(conf) {
    return yp.mix(true, new yp.fn.create(conf), yp);
  }
  yp.fn = yp.prototype = {
    constructor: yp
  , yp: 'min.20140426.1'
  , create: function(conf) {
      return this;
    }
  }
  yp.fn.create.prototype = yp.fn;
  yp.create = yp.fn.create;

  /* 语法糖扩展 */
  // 对象扩展
  yp.mix = $.extend;
  yp.extend = function(a, b) {
    return yp.mix({}, a, b);
  };
  // 对象循环
  yp.each = function(arr, callback) {
    return $.each(arr, function(a, b) {
      return callback(b, a);
    });
  };
  // 代理函数
  yp.proxy = $.proxy;
  // 模板函数
  yp.format = function(str, data) {
    if (!str) {
      throw new Error('yp.format字符串参数不能为空');
      return '';
    }
    var re = this.re || /\${([\s\S]+?)}/g
    if (typeof data !== 'object') data = [].slice.call(arguments, 1);
    return str.replace(re, function($0, $1) {
      return data[$1] != null ? data[$1] : '';
    });
  };
  // 空函数
  yp.noop = $.noop;

  yp.mix(yp, {
    rword: /[^, ]+/g
  , global: {}  /*全局变量*/
  , config: {}  /*全局配置*/
  , loader: {}  /*资源加载*/
  , loger: {}   /*日志输出*/
  , mods: {}    /*全局模块*/
  , cache: {}   /*全局缓存*/
  , event: {}   /*全局事件*/
  , ui: {}      /*全局UI*/
  , system: {}  /*系统函数*/
  });

  win.yp = yp;
}(this, jQuery);

/* 全局事件管理event */
!function($, yp) {
var 
  exports = yp
, api = exports.event
, o = $({})
  
  api.sub = function() {
    var eventName = arguments[0]
      , data = o.data(eventName.replace(/\..*/, ''))
    if (data) {
      var callback = arguments[1]
      callback(data);
      return;
    }
    o.on.apply(o, arguments);
  };
  api.unsub = function() {
    o.off.apply(o, arguments);
  };
  api.pub = function() {
    o.trigger.apply(o, arguments);
    var eventName = arguments[0]
    return {
      cache: function(val) {
        eventName = typeof eventName === 'string' ? eventName : eventName.type + '.' + eventName.namespace;
        o.data(eventName, val || true);
      }
    }
  };

  // 系统观察者
  exports.sub = $.sub = api.sub;
  exports.unsub = $.unsub = api.unsub;
  exports.pub = $.pub = api.pub;
}(jQuery, yp);

/* 全局加载loader */
!function($, yp) {
var
  win = this
, exports = yp
, api = exports.loader

  // 全局页面初始化完成
  api.ready = function() {
    var nReadyCount = 1
    $.sub('doc-ready', function() {
      if (--nReadyCount <= 0) {
        api.ready();
      }
    });
    return function(callback) {
      if (callback) {
        $.sub('yp/ready', callback);
      } else {
        // 触发页面初始化事件
        $.pub('yp/ready').cache();
      }
    }
  }();
  exports.ready = api.ready;

  // ajax
  function ajax() {
    return $.ajax.apply($, arguments);
  }
  api.ajax = exports.ajax = ajax;
  /* 异步提交表单 */
  /* 临时缓存队列（避免重复ajax请求） */
  var ajaxList = {}
  function ajaxSubmit(url, opts) {
    if (typeof url === 'object') {
      opts = url;
      url = opts.url;
    }
    opts = opts || {};
    var $target = $(opts.target)
      , dfd = $.Deferred()

    if (!$target.length) {
      $.pub('error/ui', {code:'noFormSubmit', message:'没有找到要提交的表单'});
      return dfd;
    }

    // 组装提交数据
    url = url || $target.attr('action');
    if (ajaxList[url]) return ajaxList[url];
    
    var type = opts.type || 'POST'
    var data_list = [];
    var data = $target.serialize();
    data && data_list.push(data);
    data = opts.data;
    data && (typeof(data) != 'string' && (data = $.param(data)));
    data && data_list.push(data);
    data = data_list.join('&');

    return ajaxList[url] = api.ajax(url, {
        type: type
      , data: data
      })
      .always(function(e) {
        delete ajaxList[url];
      });
  };
  api.ajaxSubmit = ajaxSubmit;

  $.fn.ajaxSubmit = function(url, opts) {
    if (typeof url === 'object') {
      opts = url || {};
    } else {
      opts = opts || {};
      opts.url = url;
    }
    opts.target = this;
    this.ajax = ajaxSubmit(opts);
    return this;
  };

  // 初始化
  api.init = function() {
    // 文档加载
    $(function() {
      $.pub('doc-ready').cache();
    });
  };
}(jQuery, yp);

/* 全局UI */
!function($, yp) {
var
  win = this
, exports = yp
, api = exports.ui

  yp.mix(api, {
    // 键位数组
    keyCode: {
      BACKSPACE: 8
    , COMMA: 188
    , DELETE: 46
    , DOWN: 40
    , END: 35
    , ENTER: 13
    , ESCAPE: 27
    , HOME: 36
    , LEFT: 37
    , NUMPAD_ADD: 107
    , NUMPAD_DECIMAL: 110
    , NUMPAD_DIVIDE: 111
    , NUMPAD_ENTER: 108
    , NUMPAD_MULTIPLY: 106
    , NUMPAD_SUBTRACT: 109
    , PAGE_DOWN: 34
    , PAGE_UP: 33
    , PERIOD: 190
    , RIGHT: 39
    , SPACE: 32
    , TAB: 9
    , UP: 3
    }
  });

  // 保存常用对象
  api.$win = $(win);
  api.$doc = $(document);
  api.$body = $(document.body);

  // 对话框
  yp.each(['alert', 'confirm'], function(name) {
    api[name] = function(msg) {
      return window[name](msg);
    };
  });

  // 全局快捷键
  $.sub('ui/keydown.ui', function(e, data) {
    var code = data.code
    if (code == api.keyCode.ESCAPE) {
      // 关闭所有弹层菜单
      $('.ibox,.modal,.mask').hide();
    }
  });
  api.$doc.on('keydown.ui.event', function(e) {
    $.pub('ui/keydown', {code:e.which, target:e.target, event:e});
  });

  // 监听窗口大小改变事件
  api.$win.on('resize.ui', function() {
    yp.pub('ui/resize');
  });
}(jQuery, yp);

// yp框架初始化
yp.create();