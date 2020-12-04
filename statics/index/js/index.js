/* ==========================================================
 * index.js v20140925
 * ==========================================================
 * Copyright weiluxia
 *
 * 边锋官网-首页
 * ========================================================== */

$(function() {
  var ui = yp.ui;
  ui.$carousel = $('[data-toggle=carousel]');
  ui.$yp_menus = $('#yp-menus');
  ui.$yp_links = $('#yp-links');
  ui.$yp_customScroll = $('#yp-customScroll');

  var oConfig = window.oPageConfig;

  var oPage = {
    // 初始化
    init: function() {
      this.view();
      this.listen();
    }
    // 视图管理
  , view: function() {
      var self = this;

      // 轮播
      ui.$carousel.carousel({a: 'li', bSetInterval: true, active: 'cur', bNextPrev: true, hNextPrev: true});
      
      // 自定义滚动条(不支持ie7,ie6)
      if(!oConfig.bIE7) {
        ui.$yp_customScroll.mCustomScrollbar({autoHideScrollbar:true});
      }

    }
    // 事件绑定
  , listen: function() {
      var self = this;

      // 下拉菜单
      ui.$yp_menus.find('li').hover(function() {
        var $this = $(this);
        $this.toggleClass('active');
        $this.find('.menu-list').length && $this.find('.menu-list').stop().slideToggle();
      });

      ui.$yp_links.hover(function() {
        var $this = $(this);
        $this.find('.links-list').stop().slideToggle();
        !oConfig.bIE7 && ui.$yp_customScroll.mCustomScrollbar("update");
      });
    }
  };
  oPage.init();
});