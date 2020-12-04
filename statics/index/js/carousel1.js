var carousel = function (_this ,opt) {
    this.bNumList = opt.bNumList;
    this.bNextPrev = opt.bNextPrev;
    this.hNextPrev = opt.hNextPrev;
    this.$this = $(_this);
    this.event = opt.event;
    this.li = opt.li;
    this.a = opt.a;
    this.active = opt.active;
    this.animateTime = opt.animateTime;
    this.setIntervalTime = opt.setIntervalTime;
    this.bSetInterval = opt.bSetInterval;
    this.index = 0;
    this.init();
}

carousel.prototype = {
  constructor: carousel
, nTimer: 0
, init: function(  ){
    var self = this;
      self.$picList = self.$this.find('[data-picList = carousel], .picList');
    if(self.bNextPrev) {
      self.$this.find('[data-next], .next').length || self.$this.append(' <a href="javascript;" class="next" data-next="carousel">next</a>');
      self.$this.find('[data-prev], .prev').length || self.$this.append(' <a href="javascript;" class="prev" data-prev="carousel">prev</a>');
    }
    if (self.bNumList){
      var str='';
      for(var i= 0, len= self.$picList.find(self.li).length; i<len; i++){
        if( i == 0){
          str +='<a class="' + self.active + '">'+(i+1)+'</a>';
        }else{
          str +='<a>'+(i+1)+'</a>';
        }
      }
      var sHTML= '<div class="numList" data-numList="carousel">'+str+'</div>';
      self.$this.find('[data-numList], .numList').length || self.$this.append(sHTML);
    }
    self.$next = self.$this.find('.next, [data-next]');
    self.$prev = self.$this.find('.prev, [data-prev]');
    self.$numList = self.$this.find('.numList, [data-numList=carousel]');
    self.bindEvent();
  }
, bindEvent: function(){
    var self = this;
    if(self.hNextPrev) {
      self.$this.hover(
        function(){
          self.$prev.show()
                    .css("opacity", 1)
                    .hover(
                      function(){
                        $(this).stop(true, false).animate({
                          "opacity": "1"
                        }, 300);}
                    , function(){
                      $(this).stop(true, false).animate({
                        "opacity": "1"}, 300);}
                    );
          self.$next.show()
                    .css("opacity", 1)
                    .hover(
                      function(){
                        $(this).stop(true, false).animate({
                          "opacity": "1"
                        }, 300);}
                    , function(){
                      $(this).stop(true, false).animate({
                        "opacity": "1"}, 300);}
                    );
        }
      , function() {
        self.$prev.hide();
        self.$next.hide();
      }
      );
    }
    if(self.bSetInterval){
      self.timer = setInterval(function(){
        self.fNext();
      }, self.setIntervalTime);
      self.$this.on('mouseenter', function () {
        clearInterval(self.timer);
      });
      self.$this.on('mouseleave', function () {
        self.timer = setInterval(function(){
          self.fNext();
        }, self.setIntervalTime);
     });
     }
    if(self.bNextPrev){
      self.$next.on(self.event, function(){
        self.fNext();
        return false;
      });
      self.$prev.on(self.event, function(){
        self.fPrev();
        return false;
      });
    }
    if(self.bNumList){
      self.$numList.on(self.event, self.a + ':not(.' + self.active + ')', function () {
        self.index = $(this).index();
        self.fAnimate(self.index);
        return false;
      });
    }
  }
, fNext: function(){
    var self = this
      , len = self.$picList.find(self.li).length;
        self.index = self.$picList.find('.' + self.active).index();
    if (self.index == len - 1) {
      self.fAnimate(0)
    } else {
      self.fAnimate(self.index + 1);
    }
    return false;
  }
, fPrev: function(){
    var self = this
       , len = self.$picList.find(self.li).length;
    self.index = self.$picList.find('.' + self.active).index();
    if (self.index == 0) {
      self.fAnimate(len -1);
    } else {
      self.fAnimate(self.index - 1);
    }
    return false;
  }
, fAnimate: function(i){
    var self = this
      , picWidth = self.$picList.width();
    if(self.$picList.find('.' + self.active).is(":animated")) {
      return false;     //如果正在进行动画点击操作无效
    }
    self.$numList.length && self.$numList.find(self.a).removeClass(self.active).eq(i).addClass(self.active);
    $('#a').html(self.$numList.find(self.a + '.' + self.active).html());
    self.$picList.find('.' + self.active).animate({
      left:-picWidth
    }, self.animateTime, function () {
      $(this).removeClass(self.active);
      $(this).css('left', picWidth);
    });
    self.$picList.find(self.li).eq(i).animate({
      left:0
    }, self.animateTime, function () {
      $(this).addClass(self.active);
    });
  }
}
$.fn.carousel = function (opt) {
  return this.each(function () {
      var $this = $(this);
      var opts=$.extend({}, $.fn.carousel.defaults, $this.data(), typeof opt== 'object' && opt)
      , data = $this.data('carousel');
      if(!data){$this.data('carousel',(data=new carousel(this,opts)))}
  });
};
$.fn.carousel.defaults ={
    bNumList: true,
    bNextPrev: false, // 出现next和prev按钮
    hNextPrev: false, // 图片hover时出现next和prev
    bSetInterval: true,
    event: 'click tap',
    li: 'li', //picList 事件绑定元素
    a: 'a',  //numList 事件绑定元素
    setIntervalTime: 6000,
    animateTime: 400
};
$.fn.carousel.Constructor = carousel;
