// JavaScript Document
//进度条处理
export default class Progress {
  constructor($progressParams) {
    this.horizontalBarIsMoving = false; //横向进度条在移动
    // Horizontal Longitudinal
    this.progressParams = ['$horizontalPro', '$horizontalCur', '$horizontalBtn',
      '$longitudinalPro', '$longitudinalCur', '$longitudinalBtn'
    ];
    this.setParams(this.progressParams, $progressParams);
  }

  setParams(params, datas) {
    if (!datas) {
      return;
    }
    params.forEach((ele) => {
      if (datas[ele]) {
        this[ele] = datas[ele]
      }
    });
  }
  //横向进度条点击
  horizontalClick(callBack) {
    let $this = this;
    this.$horizontalPro.click(function(event) {
      let initLeftWidth = Number($(this).offset().left);
      let currentLeftWidth = Number(event.pageX);
      let horizontalWidth = Number(currentLeftWidth - initLeftWidth);
      let initWidth = $(this).width();
      if (horizontalWidth < 0) {
        return;
      }

      let horizontalPercent = Number(horizontalWidth / initWidth);
      if (isNaN(horizontalPercent)) {
        return;
      }
      if (horizontalPercent > 1) {
        horizontalPercent = 1;
      }
      let widthpPercent = horizontalPercent * 100 + '%';
      let btnWidth = $this.$horizontalBtn.width();
      let left = horizontalWidth - btnWidth / 2;
      $this.$horizontalCur.css('width', widthpPercent);
      $this.$horizontalBtn.css('left', left);
      callBack(horizontalPercent);
    });
  }
  //横向进度条拖动
  horizontalMove(callBack) {
    let $this = this;
    let horizontalWidth;
    let horizontalPercent;

    this.$horizontalBtn.mousedown(function() {
      $this.horizontalBarIsMoving = true;
      let initLeftWidth = $this.$horizontalPro.offset().left;
      $(document).mousemove(function(event) {
        let currentLeftWidth = event.pageX;
        horizontalWidth = currentLeftWidth - initLeftWidth;

        let initWidth = $this.$horizontalPro.width();
        if (horizontalWidth < 0) {
          return;
        }

        horizontalPercent = Number(horizontalWidth / initWidth);
        if (isNaN(horizontalPercent)) {
          return;
        }
        if (horizontalPercent > 1) {
          horizontalPercent = 1;
        }

        let widthpPercent = horizontalPercent * 100 + '%';
        let btnWidth = $this.$horizontalBtn.width();
        let left = Number(horizontalWidth - btnWidth / 2);
        if (left > (Number(initWidth - btnWidth / 2))) {
          return;
        }
        $this.$horizontalCur.css('width', widthpPercent);
        $this.$horizontalBtn.css('left', left);
      });
    });
    $(document).mouseup(function() {
      $(document).off('mousemove');
      $(document).off('mousedown');
      $this.horizontalBarIsMoving = false;
    });
    if (!$this.horizontalBarIsMoving) {
      callBack(horizontalPercent);
    }
  }
  //纵向进度条点击
  longitudinalClick(callBack) {
    let $this = this;
    this.$longitudinalPro.click(function(event) {
      let initTopHeight = Number($(this).offset().top);
      let currentTopHeight = Number(event.pageY);
      let longitudinalHeight = Number(currentTopHeight - initTopHeight);
      let initHeight = Number($(this).height());
      let percentHeight = initHeight - longitudinalHeight;
      let percent = percentHeight / initHeight;
      let heightPercent = percent * 100 + '%';
      let btnHeight = $this.$longitudinalBtn.height();
      percentHeight = Number(percentHeight - btnHeight / 2);
      if (percent > 1 || percent < 0) {
        return;
      }
      $this.$longitudinalCur.css('height', heightPercent);
      $this.$longitudinalBtn.css('bottom', percentHeight);

      if (isNaN(percent)) {
        return;
      }
      callBack(percent);
    });
  }
  longitudinalMove(callBack) {
    let $this = this;
    this.$longitudinalBtn.mousedown(function() {
      let initTopHeight = $this.$longitudinalPro.offset().top;
      $(document).mousemove(function() {
        let currentTopHeight = event.pageY;
        let longitudinalHeight = currentTopHeight - initTopHeight;
        let initHeight = Number($this.$longitudinalPro.height());
        let percentHeight = Number(initHeight - longitudinalHeight);
        let percent = percentHeight / initHeight;
        let heightPercent = percent * 100 + '%';
        let btnHeight = $this.$longitudinalBtn.height();
        percentHeight = Number(percentHeight - btnHeight / 2);
        if (percent > 1 || percent < 0) {
          return;
        }
        $this.$longitudinalCur.css('height', heightPercent);
        $this.$longitudinalBtn.css('bottom', percentHeight);

        callBack(percent);
      });
    });
    $(document).mouseup(function() {
      $(document).off('mousemove');
    });
  }
}
